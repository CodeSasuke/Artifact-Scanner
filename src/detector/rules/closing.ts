import { RulePattern } from '../types';

export const closingRules: RulePattern[] = [
  {
    id: 'closing-hope-this-helps',
    category: 'AI_STYLE_CLOSING',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:I\s+)?hope\s+this\s+helps(?:\s+(?:you\s+)?(?:understand|clarify|with|out|get\s+started))?[^.!?\n]*[!.]*)/gi,
    confidence: 0.98,
    explanation: 'Classic assistant concluding sign-off pleasantry.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational closing pleasantry.',
      replacement: '',
    }),
  },
  {
    id: 'closing-feel-free-to-ask',
    category: 'AI_STYLE_CLOSING',
    pattern: /(?:(?:^|[.!?\n])\s*)(Feel\s+free\s+to\s+(?:ask|reach\s+out|let\s+me\s+know)\s+if\s+you\s+(?:have|need|run\s+into)[^.!?\n]*[!.]*)/gi,
    confidence: 0.96,
    explanation: 'Interactive sign-off encouraging further conversation.',
    generateSuggestion: () => ({
      suggestion: 'Remove assistant sign-off.',
      replacement: '',
    }),
  },
  {
    id: 'closing-do-not-hesitate',
    category: 'AI_STYLE_CLOSING',
    pattern: /(?:(?:^|[.!?\n])\s*)(Do\s*n['’]t\s+hesitate\s+to\s+(?:ask|reach\s+out|follow\s+up)\s+if\s+[^.!?\n]*[!.]*)/gi,
    confidence: 0.95,
    explanation: 'Customer support / assistant style sign-off formula.',
    generateSuggestion: () => ({
      suggestion: 'Remove sign-off sentence.',
      replacement: '',
    }),
  },
  {
    id: 'closing-happy-to-assist-anytime',
    category: 'AI_STYLE_CLOSING',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Always\s+|I\s+am\s+|I['’]?m\s+)?happy\s+to\s+(?:help|assist)\s+(?:you\s+)?anytime[!.]*)/gi,
    confidence: 0.92,
    explanation: 'Conversational assistant closure.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational sign-off.',
      replacement: '',
    }),
  },
  {
    id: 'closing-wishing-best-of-luck',
    category: 'AI_STYLE_CLOSING',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Good|Best\s+of)\s+luck\s+with\s+your\s+[^.!?\n]*[!.]*)/gi,
    confidence: 0.88,
    explanation: 'Conversational parting wish typical of assistant generation.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational parting remark.',
      replacement: '',
    }),
  },
  {
    id: 'closing-happy-coding-writing',
    category: 'AI_STYLE_CLOSING',
    pattern: /(?:(?:^|[.!?\n])\s*)(Happy\s+(?:coding|learning|writing|building|exploring)[^.!?\n]*[!.]*)/gi,
    confidence: 0.90,
    explanation: 'Conversational cheerio / sign-off salutation.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational salutation.',
      replacement: '',
    }),
  },
];
