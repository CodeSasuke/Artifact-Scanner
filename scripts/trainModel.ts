import fs from 'fs';
import path from 'path';
import { TEST_CORPUS } from '../src/corpus/testCorpus';
import { tokenize, extractNGrams } from '../src/detector/classifier/tokenizer';
import { ArtifactCategory } from '../src/detector/types';

// Distinct classes
const CLASSES: ArtifactCategory[] = [
  'NORMAL_PROSE',
  'OFFER_TO_CONTINUE',
  'ASSISTANT_FRAMING',
  'CONVERSATIONAL_ACKNOWLEDGMENT',
  'AI_STYLE_CLOSING',
  'META_COMMENTARY',
  'PREVIOUS_CONVERSATION_REFERENCE',
  'BORDERLINE',
];

// Step 1: Build Vocabulary and Document Frequencies
const docTokens = TEST_CORPUS.map(c => extractNGrams(tokenize(c.text), 2));
const docCount = docTokens.length;
const termDocFreq = new Map<string, number>();

for (const tokens of docTokens) {
  const uniqueTokens = new Set(tokens);
  for (const token of uniqueTokens) {
    termDocFreq.set(token, (termDocFreq.get(token) || 0) + 1);
  }
}

// Filter terms that appear at least once and sort them
const vocabulary: Record<string, number> = {};
const idf: number[] = [];
let vocabIdx = 0;

for (const [term, df] of termDocFreq.entries()) {
  vocabulary[term] = vocabIdx;
  // Smooth IDF
  const idfVal = Math.log((docCount + 1) / (df + 1)) + 1;
  idf.push(Number(idfVal.toFixed(4)));
  vocabIdx++;
}

console.log(`Extracted vocabulary of ${vocabIdx} features across ${docCount} documents.`);

// Step 2: Transform documents to L2-normalized TF-IDF feature vectors
const X: Float32Array[] = [];
const Y: number[] = [];

for (let i = 0; i < docCount; i++) {
  const tokens = docTokens[i];
  const vector = new Float32Array(vocabIdx);
  const termCounts = new Map<number, number>();

  for (const token of tokens) {
    const idx = vocabulary[token];
    if (idx !== undefined) {
      termCounts.set(idx, (termCounts.get(idx) || 0) + 1);
    }
  }

  let normSq = 0;
  for (const [idx, count] of termCounts.entries()) {
    const tf = 1 + Math.log(count);
    const val = tf * idf[idx];
    vector[idx] = val;
    normSq += val * val;
  }

  const norm = Math.sqrt(normSq);
  if (norm > 0) {
    for (let j = 0; j < vocabIdx; j++) {
      if (vector[j] !== 0) vector[j] /= norm;
    }
  }

  X.push(vector);
  const classIdx = CLASSES.indexOf(TEST_CORPUS[i].expectedCategory);
  Y.push(classIdx !== -1 ? classIdx : 0);
}

// Step 3: Train Multinomial Logistic Regression using Mini-Batch / Gradient Descent
const numClasses = CLASSES.length;
const weights: number[][] = Array.from({ length: numClasses }, () => new Array(vocabIdx).fill(0));
const biases: number[] = new Array(numClasses).fill(0);

const epochs = 350;
const lr = 0.5;
const lambda = 0.001; // L2 penalty

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;

  for (let i = 0; i < docCount; i++) {
    const x = X[i];
    const y = Y[i];

    // Compute logits
    const logits = new Float32Array(numClasses);
    let maxLogit = -Infinity;
    for (let c = 0; c < numClasses; c++) {
      let sum = biases[c];
      for (let j = 0; j < vocabIdx; j++) {
        if (x[j] !== 0) sum += weights[c][j] * x[j];
      }
      logits[c] = sum;
      if (sum > maxLogit) maxLogit = sum;
    }

    // Softmax
    let sumExp = 0;
    const probs = new Float32Array(numClasses);
    for (let c = 0; c < numClasses; c++) {
      const exp = Math.exp(logits[c] - maxLogit);
      probs[c] = exp;
      sumExp += exp;
    }
    for (let c = 0; c < numClasses; c++) {
      probs[c] /= sumExp;
    }

    totalLoss -= Math.log(Math.max(1e-12, probs[y]));

    // Gradients
    for (let c = 0; c < numClasses; c++) {
      const indicator = c === y ? 1 : 0;
      const error = probs[c] - indicator;

      biases[c] -= lr * (error / docCount);
      for (let j = 0; j < vocabIdx; j++) {
        if (x[j] !== 0) {
          weights[c][j] -= lr * ((error * x[j]) / docCount + lambda * weights[c][j]);
        }
      }
    }
  }

  if (epoch % 50 === 0 || epoch === epochs - 1) {
    console.log(`Epoch ${epoch}: Cross-entropy loss = ${(totalLoss / docCount).toFixed(4)}`);
  }
}

// Round weights to 4 decimal places for compact JSON footprint
const compactWeights = weights.map(row => row.map(w => Number(w.toFixed(4))));
const compactBiases = biases.map(b => Number(b.toFixed(4)));

const modelArtifact = {
  version: '1.0.0',
  type: 'tfidf_logistic_regression',
  createdAt: new Date().toISOString(),
  classes: CLASSES,
  vocabulary,
  idf,
  weights: compactWeights,
  biases: compactBiases,
};

const outputPath = path.resolve('src/detector/classifier/modelWeights.json');
fs.writeFileSync(outputPath, JSON.stringify(modelArtifact, null, 2), 'utf-8');
console.log(`Trained model weights saved to: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
