import { describe, it, expect } from 'vitest';
import { runRuleEngine } from '../src/detector/rules';

describe('Deterministic Rule Engine (Layer 1 & Layer 2)', () => {
  it('detects "Offer to continue" pattern', () => {
    const text = 'If you want, I can also explain columns, primary keys, or other DBMS terms.';
    const findings = runRuleEngine(text);

    expect(findings.length).toBeGreaterThan(0);
    const finding = findings[0];
    expect(finding.category).toBe('OFFER_TO_CONTINUE');
    expect(finding.confidence).toBeGreaterThanOrEqual(0.9);
    expect(finding.explanation).toContain('assistant');
  });

  it('detects "Assistant framing" preamble', () => {
    const text = 'Here is a clear and simple explanation of a Column in DBMS: It stores values.';
    const findings = runRuleEngine(text);

    expect(findings.length).toBeGreaterThan(0);
    const finding = findings[0];
    expect(finding.category).toBe('ASSISTANT_FRAMING');
    expect(finding.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('detects "Conversational acknowledgment" opener', () => {
    const text = "Sure! I'd be happy to help you with that.";
    const findings = runRuleEngine(text);

    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].category).toBe('CONVERSATIONAL_ACKNOWLEDGMENT');
  });

  it('detects "AI style closing"', () => {
    const text = 'This completes the installation. I hope this helps!';
    const findings = runRuleEngine(text);

    expect(findings.length).toBeGreaterThan(0);
    const closingFinding = findings.find(f => f.category === 'AI_STYLE_CLOSING');
    expect(closingFinding).toBeDefined();
    expect(closingFinding?.matchedText).toContain('hope this helps');
  });

  it('detects "Meta commentary"', () => {
    const text = 'As an AI language model, I do not possess personal opinions.';
    const findings = runRuleEngine(text);

    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].category).toBe('META_COMMENTARY');
  });

  it('detects "Previous conversation reference"', () => {
    const text = 'As we discussed earlier in our previous chat, the timeline shifted.';
    const findings = runRuleEngine(text);

    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].category).toBe('PREVIOUS_CONVERSATION_REFERENCE');
  });

  it('respects disabled categories', () => {
    const text = 'If you want, I can also explain columns, primary keys, or other DBMS terms.';
    const findings = runRuleEngine(text, {
      disabledCategories: ['OFFER_TO_CONTINUE'],
    });

    expect(findings.length).toBe(0);
  });

  it('respects user-defined ignored phrases', () => {
    const text = 'If you want, I can also explain columns, primary keys, or other DBMS terms.';
    const findings = runRuleEngine(text, {
      ignoredPhrases: ['if you want, i can also explain'],
    });

    expect(findings.length).toBe(0);
  });

  it('does not flag standard formal sentences', () => {
    const text = 'Relational database management systems organize data into structured tables consisting of rows and columns.';
    const findings = runRuleEngine(text);

    expect(findings.length).toBe(0);
  });
});
