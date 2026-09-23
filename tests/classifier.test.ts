import { describe, it, expect } from 'vitest';
import { tokenize, extractNGrams, splitIntoSentences } from '../src/detector/classifier/tokenizer';
import { getLocalClassifier } from '../src/detector/classifier/localClassifier';

describe('Local NLP Classifier (Layer 3)', () => {
  it('tokenizes and extracts n-grams cleanly', () => {
    const tokens = tokenize('Here is a clear explanation!');
    expect(tokens).toEqual(['here', 'is', 'clear', 'explanation']);

    const ngrams = extractNGrams(tokens, 2);
    expect(ngrams).toContain('here_is');
    expect(ngrams).toContain('is_clear');
  });

  it('splits multiline and multi-sentence text with exact spans', () => {
    const text = 'First sentence here. Second sentence follows! Third one?';
    const spans = splitIntoSentences(text);

    expect(spans.length).toBe(3);
    expect(spans[0].text).toBe('First sentence here.');
    expect(spans[0].start).toBe(0);
    expect(text.substring(spans[0].start, spans[0].end)).toBe('First sentence here.');
  });

  it('runs offline local classification and predicts probabilities without remote APIs', () => {
    const classifier = getLocalClassifier();
    expect(classifier.name).toBe('ArtifactScanner-LocalTFIDF-LR');

    const result = classifier.classify('If you want, I can also provide more details.');
    expect(result.probabilities).toBeDefined();
    expect(result.category).toBe('OFFER_TO_CONTINUE');
    expect(result.confidence).toBeGreaterThan(0.4);
  });

  it('classifies normal prose as NORMAL_PROSE', () => {
    const classifier = getLocalClassifier();
    const result = classifier.classify('The solar panels convert twenty percent of sunlight into electricity.');
    expect(result.category).toBe('NORMAL_PROSE');
  });
});
