import { describe, it, expect } from 'vitest';
import { TEST_CORPUS } from '../src/corpus/testCorpus';
import { DetectionPipeline } from '../src/detector/pipeline/detectionPipeline';

describe('Test Corpus Suite (120+ Labeled Cases)', () => {
  it('contains at least 100 test cases', () => {
    expect(TEST_CORPUS.length).toBeGreaterThanOrEqual(100);
  });

  it('maintains zero false positives on normal prose', () => {
    const normalCases = TEST_CORPUS.filter(c => !c.isArtifact);
    expect(normalCases.length).toBeGreaterThanOrEqual(30);

    const falsePositives: { id: string; text: string; findings: any[] }[] = [];

    for (const testCase of normalCases) {
      const findings = DetectionPipeline.detect(testCase.text, { minConfidence: 0.65 });
      if (findings.length > 0) {
        falsePositives.push({
          id: testCase.id,
          text: testCase.text,
          findings,
        });
      }
    }

    if (falsePositives.length > 0) {
      console.warn('False positives detected on normal prose:', falsePositives);
    }

    expect(falsePositives.length).toBe(0);
  });

  it('accurately identifies conversational artifacts with high recall', () => {
    const artifactCases = TEST_CORPUS.filter(c => c.isArtifact);
    let detectedCount = 0;
    const missedCases: { id: string; text: string; expectedCategory: string }[] = [];

    for (const testCase of artifactCases) {
      const findings = DetectionPipeline.detect(testCase.text, { minConfidence: 0.60 });
      if (findings.length > 0) {
        detectedCount++;
      } else {
        missedCases.push({
          id: testCase.id,
          text: testCase.text,
          expectedCategory: testCase.expectedCategory,
        });
      }
    }

    const recall = detectedCount / artifactCases.length;
    console.log(`Corpus Artifact Recall: ${(recall * 100).toFixed(1)}% (${detectedCount}/${artifactCases.length})`);

    if (missedCases.length > 0) {
      console.warn('Missed artifact cases:', missedCases);
    }

    // Expect at least 95% recall on conversational artifacts
    expect(recall).toBeGreaterThanOrEqual(0.95);
  });

  it('matches expected category for detected artifacts', () => {
    const artifactCases = TEST_CORPUS.filter(c => c.isArtifact && c.expectedCategory !== 'BORDERLINE');
    let categoryMatches = 0;

    for (const testCase of artifactCases) {
      const findings = DetectionPipeline.detect(testCase.text, { minConfidence: 0.60 });
      if (findings.length > 0) {
        const topFinding = findings[0];
        if (topFinding.category === testCase.expectedCategory) {
          categoryMatches++;
        }
      }
    }

    const accuracy = categoryMatches / artifactCases.length;
    console.log(`Category Matching Accuracy: ${(accuracy * 100).toFixed(1)}%`);
    expect(accuracy).toBeGreaterThanOrEqual(0.90);
  });
});
