import { Finding } from '../types';

/**
 * Layer 2: Structural and Contextual rules.
 * Analyzes sentence positions, document boundaries, and structural signals.
 */
export function applyStructuralAnalysis(text: string, findings: Finding[]): Finding[] {
  const trimmed = text.trim();
  const enhancedFindings = [...findings];

  // Boost confidence of lead-in framing if it occurs in the first 15% of the text
  const leadBoundary = Math.max(100, Math.floor(text.length * 0.15));
  // Boost confidence of closings/offers if they occur in the last 20% of the text
  const tailBoundary = Math.max(0, text.length - Math.max(150, Math.floor(text.length * 0.20)));

  for (const finding of enhancedFindings) {
    if (finding.category === 'ASSISTANT_FRAMING' || finding.category === 'CONVERSATIONAL_ACKNOWLEDGMENT') {
      if (finding.start <= leadBoundary) {
        finding.confidence = Math.min(0.99, Number((finding.confidence * 1.05).toFixed(2)));
      }
    } else if (finding.category === 'OFFER_TO_CONTINUE' || finding.category === 'AI_STYLE_CLOSING') {
      if (finding.end >= tailBoundary) {
        finding.confidence = Math.min(0.99, Number((finding.confidence * 1.05).toFixed(2)));
      }
    }
  }

  // Detect standalone concluding assistant sentences like: "Hope this helps!", "Let me know if you need anything else."
  const trailingSentenceMatch = /(?:^|\n|\.\s+)([A-Z][^.!?\n]*(?:(?:hope\s+this\s+helps)|(?:feel\s+free\s+to\s+(?:ask|reach\s+out))|(?:let\s+me\s+know\s+if\s+you)|(?:(?:always\s+)?happy\s+to\s+(?:help|assist)\s+(?:you|anytime)))[^.!?\n]*[.!?]?)\s*$/i.exec(trimmed);
  if (trailingSentenceMatch && trailingSentenceMatch[1]) {
    const matchedSegment = trailingSentenceMatch[1].trim();
    const startIndex = text.lastIndexOf(matchedSegment);
    if (startIndex !== -1) {
      // Check if already captured by another finding
      const alreadyCaptured = enhancedFindings.some(f => 
        (startIndex >= f.start && startIndex < f.end) ||
        (f.start >= startIndex && f.start < startIndex + matchedSegment.length)
      );
      if (!alreadyCaptured) {
        enhancedFindings.push({
          id: `structural-tail-${startIndex}`,
          start: startIndex,
          end: startIndex + matchedSegment.length,
          category: 'AI_STYLE_CLOSING',
          confidence: 0.93,
          explanation: 'Concluding sentence resembles an assistant closing note at the end of the text.',
          suggestion: 'Remove conversational closing.',
          matchedText: matchedSegment,
          sourceLayer: 'rule',
          ruleId: 'structural-trailing-closure',
          replacement: '',
        });
      }
    }
  }

  return enhancedFindings;
}
