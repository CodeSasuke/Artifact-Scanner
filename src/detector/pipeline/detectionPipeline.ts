import { Finding, DetectionOptions, ScanResult } from '../types';
import { runRuleEngine } from '../rules';
import { getClassifierEngine } from '../classifier';

export class DetectionPipeline {
  /**
   * Main entry point to detect conversational artifacts in text
   */
  public static detect(text: string, options: DetectionOptions = {}): Finding[] {
    if (!text || typeof text !== 'string') {
      return [];
    }

    const minConfidence = options.minConfidence ?? 0.60;
    const ruleFindings = runRuleEngine(text, options);

    let classifierFindings: Finding[] = [];
    if (options.enableClassifier !== false) {
      try {
        const engine = getClassifierEngine();
        classifierFindings = engine.detect(text, {
          ...options,
          minConfidence: Math.max(minConfidence, 0.70),
        });
      } catch (err) {
        console.warn('Classifier detection error:', err);
      }
    }

    return this.mergeFindings(ruleFindings, classifierFindings, minConfidence);
  }

  /**
   * Runs detection and computes cleaned text result
   */
  public static scan(text: string, options: DetectionOptions = {}): ScanResult {
    const findings = this.detect(text, options);
    const cleanedText = this.applyCleanup(text, findings);

    return {
      originalText: text,
      findings,
      cleanedText,
      scannedAt: Date.now(),
    };
  }

  /**
   * Merges findings from deterministic rules and ML classifier
   */
  private static mergeFindings(
    ruleFindings: Finding[],
    classifierFindings: Finding[],
    minConfidence: number
  ): Finding[] {
    const merged: Finding[] = [...ruleFindings];

    for (const cf of classifierFindings) {
      // Check for overlap with existing rule findings
      const overlappingIndex = merged.findIndex(rf => 
        (cf.start < rf.end && cf.end > rf.start)
      );

      if (overlappingIndex !== -1) {
        const existing = merged[overlappingIndex];
        // Agreement between rule and ML classifier: upgrade to hybrid with boosted confidence
        if (existing.category === cf.category) {
          existing.sourceLayer = 'hybrid';
          existing.confidence = Math.min(0.99, Number((Math.max(existing.confidence, cf.confidence) + 0.04).toFixed(2)));
        }
      } else {
        // Classifier found something rules missed
        if (cf.confidence >= minConfidence) {
          merged.push(cf);
        }
      }
    }

    // Sort by start position
    return merged.sort((a, b) => a.start - b.start);
  }

  /**
  /**
   * Cleans text by removing or replacing specified findings while preserving
   * sentence boundaries, proper punctuation, and valid capitalization.
   */
  public static applyCleanup(text: string, findingsToRemove: Finding[]): string {
    if (!text || findingsToRemove.length === 0) return text;

    // Sort findings descending by start index so string splices do not invalidate offsets
    const sorted = [...findingsToRemove].sort((a, b) => b.start - a.start);

    let result = text;
    for (const finding of sorted) {
      const replacement = finding.replacement !== undefined ? finding.replacement : '';
      let start = finding.start;
      let end = finding.end;

      // If removing completely, also absorb any immediately trailing comma, colon, or semicolon
      // when the finding was sentence-initial or paragraph-initial
      if (replacement === '') {
        const textBefore = result.substring(0, start);
        const isSentenceStart = /(?:^|\n|[.!?]\s*)$/.test(textBefore);
        if (isSentenceStart) {
          const trailingPunctMatch = /^[,;:]\s*/.exec(result.substring(end));
          if (trailingPunctMatch) {
            end += trailingPunctMatch[0].length;
          }
        }
      }

      result = result.substring(0, start) + replacement + result.substring(end);
    }

    return this.restoreGrammarAndFormatting(result);
  }

  /**
   * Restores grammatical validity and proper formatting after removals:
   * 1. Cleans orphan punctuation (commas, colons after sentence boundaries or at start of text/lines)
   * 2. Removes duplicate sentence terminators
   * 3. Normalizes spaces around punctuation and collapses whitespace
   * 4. Capitalizes the first letter of sentences/paragraphs where an introductory phrase was removed
   */
  public static restoreGrammarAndFormatting(text: string): string {
    if (!text) return '';

    let cleaned = text;

    // 1. Remove dangling commas, colons, or semicolons after sentence terminators (e.g., ". , " -> ". ")
    cleaned = cleaned.replace(/([.!?])\s*[,;:]+\s*/g, '$1 ');

    // 2. Remove orphan leading punctuation at the start of text or line (e.g., ", it helps" -> "it helps")
    cleaned = cleaned.replace(/^[\s,;:]+/gm, '');

    // 3. Remove duplicate consecutive sentence terminators (e.g. ".. " -> ". ")
    cleaned = cleaned.replace(/([.!?])\s*[.!?]+/g, '$1');

    // 4. Normalize spaces around punctuation: remove spaces before punctuation
    cleaned = cleaned.replace(/[ \t]+([.,!?;:])/g, '$1');

    // 5. Collapse consecutive horizontal whitespace to single space
    cleaned = cleaned.replace(/[ \t]+/g, ' ');

    // 6. Sentence capitalization fixer:
    // When a conversational prefix (e.g. "As we discussed earlier,") is removed,
    // ensure the subsequent word that now begins the sentence is capitalized.
    cleaned = cleaned.replace(/(^|\n\s*|[.!?]\s+)(['"“‘]?)([a-z])/g, (_match, prefix, quote, letter) => {
      return prefix + (quote || '') + letter.toUpperCase();
    });

    // 7. Collapse excessive blank lines and trim
    cleaned = cleaned.replace(/\n\s*\n\s*\n+/g, '\n\n');

    return cleaned.trim();
  }
}
