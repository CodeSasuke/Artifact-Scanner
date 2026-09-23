import { Finding, RulePattern, DetectionOptions } from '../types';
import { assistantFramingRules } from './assistantFraming';
import { offerToContinueRules } from './offerToContinue';
import { metaCommentaryRules } from './metaCommentary';
import { acknowledgmentRules } from './acknowledgment';
import { closingRules } from './closing';
import { previousConversationRules } from './previousConversation';
import { borderlineRules } from './borderline';
import { applyStructuralAnalysis } from './structuralRules';

export const ALL_RULES: RulePattern[] = [
  ...assistantFramingRules,
  ...offerToContinueRules,
  ...metaCommentaryRules,
  ...acknowledgmentRules,
  ...closingRules,
  ...previousConversationRules,
  ...borderlineRules,
];

export function runRuleEngine(text: string, options: DetectionOptions = {}): Finding[] {
  if (!text || typeof text !== 'string') return [];

  const disabledCategories = new Set(options.disabledCategories || []);
  const ignoredPhrases = (options.ignoredPhrases || []).map(p => p.trim().toLowerCase()).filter(Boolean);
  const minConfidence = options.minConfidence ?? 0.60;

  const rawFindings: Finding[] = [];

  for (const rule of ALL_RULES) {
    if (disabledCategories.has(rule.category)) {
      continue;
    }

    // Reset regex state
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rule.pattern.exec(text)) !== null) {
      if (rule.contextCondition && !rule.contextCondition(match, text)) {
        continue;
      }

      // If pattern has a capturing group (usually group 1 for the target phrase without leading whitespace),
      // use group 1; otherwise use the entire match (group 0).
      let matchedString = match[1] ? match[1] : match[0];
      let offset = match[1] ? match.index + match[0].indexOf(match[1]) : match.index;

      // Clean leading and trailing whitespace while adjusting offsets
      const leadingSpace = matchedString.match(/^\s*/)?.[0].length || 0;

      matchedString = matchedString.trim();
      offset += leadingSpace;

      if (!matchedString) continue;

      // Check if user has ignored this phrase
      const lowerMatched = matchedString.toLowerCase();
      const isIgnored = ignoredPhrases.some(phrase => lowerMatched.includes(phrase));
      if (isIgnored) continue;

      if (rule.confidence < minConfidence) continue;

      const suggestionInfo = rule.generateSuggestion
        ? rule.generateSuggestion(match, text)
        : { suggestion: 'Remove this conversational phrase.', replacement: '' };

      rawFindings.push({
        id: `rule-${rule.id}-${offset}`,
        start: offset,
        end: offset + matchedString.length,
        category: rule.category,
        confidence: rule.confidence,
        explanation: rule.explanation,
        suggestion: suggestionInfo.suggestion,
        matchedText: matchedString,
        sourceLayer: 'rule',
        ruleId: rule.id,
        replacement: suggestionInfo.replacement,
      });

      // Avoid infinite loops with zero-length matches
      if (match.index === rule.pattern.lastIndex) {
        rule.pattern.lastIndex++;
      }
    }
  }

  // Apply Layer 2 structural rules
  const structuralFindings = applyStructuralAnalysis(text, rawFindings);

  // Deduplicate overlapping findings, preferring higher confidence
  return deduplicateFindings(structuralFindings);
}

function deduplicateFindings(findings: Finding[]): Finding[] {
  if (findings.length <= 1) return findings;

  // Sort by start position ascending, then confidence descending
  const sorted = [...findings].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.confidence - a.confidence;
  });

  const resolved: Finding[] = [];

  for (const current of sorted) {
    const overlapIndex = resolved.findIndex(prev => 
      // Check if ranges overlap
      (current.start < prev.end && current.end > prev.start)
    );

    if (overlapIndex === -1) {
      resolved.push(current);
    } else {
      const existing = resolved[overlapIndex];
      // If current finding has strictly higher confidence, replace the existing one
      if (current.confidence > existing.confidence) {
        resolved[overlapIndex] = current;
      }
    }
  }

  return resolved.sort((a, b) => a.start - b.start);
}
