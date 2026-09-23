import { tokenize, extractNGrams } from './tokenizer';

export interface TfIdfConfig {
  vocabulary: Record<string, number>; // token -> index
  idf: number[]; // index -> idf weight
}

export class TfIdfVectorizer {
  private vocabulary: Map<string, number>;
  private idf: number[];

  constructor(config: TfIdfConfig) {
    this.vocabulary = new Map(Object.entries(config.vocabulary));
    this.idf = config.idf;
  }

  public get vocabSize(): number {
    return this.vocabulary.size;
  }

  /**
   * Transforms input text into an L2-normalized TF-IDF vector
   */
  public transform(text: string): Float32Array {
    const tokens = extractNGrams(tokenize(text), 2);
    const vector = new Float32Array(this.idf.length);

    // Count term frequencies
    const termCounts = new Map<number, number>();
    for (const token of tokens) {
      const idx = this.vocabulary.get(token);
      if (idx !== undefined) {
        termCounts.set(idx, (termCounts.get(idx) || 0) + 1);
      }
    }

    if (termCounts.size === 0) {
      return vector;
    }

    // Compute TF * IDF
    let normSq = 0;
    for (const [idx, count] of termCounts.entries()) {
      const tf = 1 + Math.log(count);
      const val = tf * (this.idf[idx] || 1);
      vector[idx] = val;
      normSq += val * val;
    }

    // L2 Normalize
    const norm = Math.sqrt(normSq);
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        if (vector[i] !== 0) {
          vector[i] /= norm;
        }
      }
    }

    return vector;
  }
}
