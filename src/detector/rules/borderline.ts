import { RulePattern } from '../types';

export const borderlineRules: RulePattern[] = [
  {
    id: 'borderline-without-further-ado',
    category: 'BORDERLINE',
    pattern: /(?:(?:^|[.!?\n])\s*)(Without\s+further\s+ado,?\s*)/gi,
    confidence: 0.70,
    explanation: 'Dramatic conversational transition that is frequently overused in generated drafts.',
    generateSuggestion: () => ({
      suggestion: 'Consider removing this transition to make writing more direct.',
      replacement: '',
    }),
  },
  {
    id: 'borderline-in-a-nutshell',
    category: 'BORDERLINE',
    pattern: /(?:(?:^|[.!?\n])\s*)(In\s+a\s+nutshell,?\s*)/gi,
    confidence: 0.68,
    explanation: 'Colloquial summary phrase commonly used in conversational summaries.',
    generateSuggestion: () => ({
      suggestion: 'Consider replacing with a formal summary transition.',
      replacement: '',
    }),
  },
  {
    id: 'borderline-delve-deep',
    category: 'BORDERLINE',
    pattern: /\b(?:delve|delved|delving)\s+into\b/gi,
    confidence: 0.65,
    explanation: '"Delve" is disproportionately prevalent in AI-generated text. Verify if it matches your personal voice.',
    generateSuggestion: () => ({
      suggestion: 'Consider alternatives like "explore", "examine", or "investigate".',
      replacement: 'examine',
    }),
  }
];
