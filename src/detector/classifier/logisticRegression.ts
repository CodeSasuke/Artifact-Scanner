import { ArtifactCategory } from '../types';

export interface LogisticRegressionModelWeights {
  classes: ArtifactCategory[];
  // weights: matrix of shape [num_classes][num_features] or flat arrays
  weights: number[][];
  biases: number[];
}

export class LogisticRegressionClassifier {
  private classes: ArtifactCategory[];
  private weights: number[][];
  private biases: number[];

  constructor(model: LogisticRegressionModelWeights) {
    this.classes = model.classes;
    this.weights = model.weights;
    this.biases = model.biases;
  }

  /**
   * Predicts class probabilities for an input feature vector
   */
  public predictProbabilities(features: Float32Array): {
    category: ArtifactCategory;
    confidence: number;
    probabilities: Record<ArtifactCategory, number>;
  } {
    const numClasses = this.classes.length;
    const logits = new Float32Array(numClasses);

    let maxLogit = -Infinity;
    for (let c = 0; c < numClasses; c++) {
      let sum = this.biases[c] || 0;
      const classWeights = this.weights[c];
      if (classWeights) {
        // Fast sparse dot product
        for (let j = 0; j < features.length; j++) {
          if (features[j] !== 0) {
            sum += classWeights[j] * features[j];
          }
        }
      }
      logits[c] = sum;
      if (sum > maxLogit) {
        maxLogit = sum;
      }
    }

    // Softmax with numerical stability (subtract maxLogit)
    let sumExp = 0;
    const expValues = new Float32Array(numClasses);
    for (let c = 0; c < numClasses; c++) {
      const exp = Math.exp(logits[c] - maxLogit);
      expValues[c] = exp;
      sumExp += exp;
    }

    const probabilities: Record<string, number> = {};
    let highestProb = -1;
    let bestIndex = 0;

    for (let c = 0; c < numClasses; c++) {
      const prob = sumExp > 0 ? expValues[c] / sumExp : 1 / numClasses;
      probabilities[this.classes[c]] = Number(prob.toFixed(4));
      if (prob > highestProb) {
        highestProb = prob;
        bestIndex = c;
      }
    }

    return {
      category: this.classes[bestIndex],
      confidence: Number(highestProb.toFixed(3)),
      probabilities: probabilities as Record<ArtifactCategory, number>,
    };
  }
}
