import { ArtifactCategory, ClassifierModel, Finding, DetectionOptions, CATEGORY_LABELS } from '../types';
import { splitIntoSentences } from './tokenizer';
import { TfIdfVectorizer } from './tfidf';
import { LogisticRegressionClassifier } from './logisticRegression';
import modelData from './modelWeights.json';

export class LocalNLPClassifier implements ClassifierModel {
  public name = 'ArtifactScanner-LocalTFIDF-LR';
  public version = '1.0.0';

  private vectorizer: TfIdfVectorizer;
  private classifier: LogisticRegressionClassifier;

  constructor() {
    this.vectorizer = new TfIdfVectorizer({
      vocabulary: modelData.vocabulary as Record<string, number>,
      idf: modelData.idf,
    });

    this.classifier = new LogisticRegressionClassifier({
      classes: modelData.classes as ArtifactCategory[],
      weights: modelData.weights,
      biases: modelData.biases,
    });
  }

  public classify(sentence: string): {
    category: ArtifactCategory;
    confidence: number;
    probabilities: Record<ArtifactCategory, number>;
  } {
    const vector = this.vectorizer.transform(sentence);
    return this.classifier.predictProbabilities(vector);
  }

  /**
   * Scans document text sentence-by-sentence using the local classifier
   */
  public detect(text: string, options: DetectionOptions = {}): Finding[] {
    if (!text || typeof text !== 'string') return [];

    const disabledCategories = new Set(options.disabledCategories || []);
    const ignoredPhrases = (options.ignoredPhrases || []).map(p => p.trim().toLowerCase()).filter(Boolean);
    const minConfidence = options.minConfidence ?? 0.70;

    const sentences = splitIntoSentences(text);
    const findings: Finding[] = [];

    for (const span of sentences) {
      // Check user ignored phrases
      const lowerSpan = span.text.toLowerCase();
      if (ignoredPhrases.some(phrase => lowerSpan.includes(phrase))) {
        continue;
      }

      const prediction = this.classify(span.text);

      // We only flag if it's an artifact category and not NORMAL_PROSE
      if (
        prediction.category !== 'NORMAL_PROSE' &&
        prediction.confidence >= minConfidence &&
        !disabledCategories.has(prediction.category)
      ) {
        const categoryInfo = CATEGORY_LABELS[prediction.category];
        findings.push({
          id: `classifier-${span.start}`,
          start: span.start,
          end: span.end,
          category: prediction.category,
          confidence: prediction.confidence,
          explanation: `Identified as conversational phrasing resembling ${categoryInfo.label.toLowerCase()}.`,
          suggestion: 'Review for conversational phrasing and remove if unintended in formal writing.',
          matchedText: span.text,
          sourceLayer: 'classifier',
          replacement: '',
        });
      }
    }

    return findings;
  }
}

// Singleton instance for extension runtime
let instance: LocalNLPClassifier | null = null;
export function getLocalClassifier(): LocalNLPClassifier {
  if (!instance) {
    instance = new LocalNLPClassifier();
  }
  return instance;
}
