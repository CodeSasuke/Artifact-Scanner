import { describe, it, expect } from 'vitest';
import { DetectionPipeline } from '../src/detector/pipeline/detectionPipeline';

describe('Detection Pipeline End-to-End', () => {
  it('scans multi-part text and returns structured findings and cleaned text', () => {
    const rawText = `Here is a clear and simple explanation of a Column in DBMS:
A column is a set of data values of a particular type, one value for each row of the database.
If you want, I can also explain columns, primary keys, or other DBMS terms.`;

    const scanResult = DetectionPipeline.scan(rawText);

    expect(scanResult.findings.length).toBeGreaterThanOrEqual(2);

    const framingFinding = scanResult.findings.find(f => f.category === 'ASSISTANT_FRAMING');
    const offerFinding = scanResult.findings.find(f => f.category === 'OFFER_TO_CONTINUE');

    expect(framingFinding).toBeDefined();
    expect(offerFinding).toBeDefined();

    // Verify cleaned text has conversational framing removed
    expect(scanResult.cleanedText).not.toContain('Here is a clear and simple explanation');
    expect(scanResult.cleanedText).not.toContain('If you want, I can also explain');
    expect(scanResult.cleanedText).toContain('A column is a set of data values');
  });

  it('handles empty or whitespace-only inputs safely', () => {
    expect(DetectionPipeline.detect('')).toEqual([]);
    expect(DetectionPipeline.detect('   ')).toEqual([]);
    expect(DetectionPipeline.scan('').cleanedText).toBe('');
  });

  it('upgrades corroborated findings to hybrid', () => {
    const text = 'If you want, I can also explain columns, primary keys, or other DBMS terms.';
    const findings = DetectionPipeline.detect(text, { enableClassifier: true });

    expect(findings.length).toBeGreaterThan(0);
    const finding = findings[0];
    // Both rule and local classifier detect this offer to continue
    expect(['hybrid', 'rule']).toContain(finding.sourceLayer);
  });

  it('correctly applies selective cleanup', () => {
    const text = 'Sentence one. If you want, I can also help. Sentence three.';
    const findings = DetectionPipeline.detect(text);
    expect(findings.length).toBeGreaterThan(0);

    // Apply cleanup for only the first finding
    const cleaned = DetectionPipeline.applyCleanup(text, [findings[0]]);
    expect(cleaned).toContain('Sentence one.');
    expect(cleaned).toContain('Sentence three.');
    expect(cleaned).not.toContain('If you want, I can also help.');
  });

  it('correctly handles partial conversational phrases and preserves valid grammar/capitalization (Regression)', () => {
    const input =
      "Sure, let's take a closer look at this concept. Database normalization is an important topic in database management systems. As we discussed earlier, it helps organize data efficiently. If you'd like, I can also walk you through an example step by step.";

    const scanResult = DetectionPipeline.scan(input);

    expect(scanResult.findings.length).toBe(3);

    const categories = scanResult.findings.map(f => f.category);
    expect(categories).toContain('ASSISTANT_FRAMING');
    expect(categories).toContain('PREVIOUS_CONVERSATION_REFERENCE');
    expect(categories).toContain('OFFER_TO_CONTINUE');

    expect(scanResult.cleanedText).toBe(
      "Database normalization is an important topic in database management systems. It helps organize data efficiently."
    );
  });
});
