/**
 * Lightweight tokenization for local NLP classification
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  // Lowercase and strip punctuation except apostrophes in contractions
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s']/g, ' ');
  return normalized
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 1);
}

/**
 * Extracts unigrams and bigrams for enhanced conversational pattern detection
 */
export function extractNGrams(tokens: string[], n: number = 2): string[] {
  const result: string[] = [...tokens];
  if (n >= 2) {
    for (let i = 0; i < tokens.length - 1; i++) {
      result.push(`${tokens[i]}_${tokens[i + 1]}`);
    }
  }
  return result;
}

/**
 * Splits text into sentence candidates with start and end character offsets
 */
export interface SentenceSpan {
  text: string;
  start: number;
  end: number;
}

export function splitIntoSentences(text: string): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  if (!text) return spans;

  // Split on sentence terminators (. ! ? or newline)
  const sentenceRegex = /[^.!?\n]+(?:[.!?]+|\n+|$)/g;
  let match: RegExpExecArray | null;

  while ((match = sentenceRegex.exec(text)) !== null) {
    const raw = match[0];
    const leadingWhitespace = raw.match(/^\s*/)?.[0].length || 0;
    const trimmed = raw.trim();

    if (trimmed.length > 0) {
      const start = match.index + leadingWhitespace;
      spans.push({
        text: trimmed,
        start,
        end: start + trimmed.length,
      });
    }
  }

  return spans;
}
