import { RulePattern } from '../types';

export const previousConversationRules: RulePattern[] = [
  {
    id: 'prev-as-we-discussed-earlier',
    category: 'PREVIOUS_CONVERSATION_REFERENCE',
    pattern: /(?:(?:^|[.!?\n])\s*)(As\s+(?:we\s+discussed|I\s+mentioned|you\s+mentioned|noted)\s+(?:earlier|previously|above|in\s+our\s+previous\s+chat)[,:]?\s*)/gi,
    confidence: 0.91,
    explanation: 'References a prior conversational turn that may be missing or awkward in self-contained writing.',
    generateSuggestion: () => ({
      suggestion: 'Rephrase to stand on its own without assuming a prior chat turn.',
      replacement: '',
    }),
  },
  {
    id: 'prev-building-on-what-you-said',
    category: 'PREVIOUS_CONVERSATION_REFERENCE',
    pattern: /(?:(?:^|[.!?\n])\s*)(Building\s+(?:on|upon)\s+(?:what\s+you\s+(?:said|asked|shared)|our\s+(?:previous|earlier)\s+conversation)[,:]?\s*)/gi,
    confidence: 0.93,
    explanation: 'Dialogue anchor referring to previous interaction context.',
    generateSuggestion: () => ({
      suggestion: 'Remove dialogue anchor.',
      replacement: '',
    }),
  },
  {
    id: 'prev-returning-to-your-point',
    category: 'PREVIOUS_CONVERSATION_REFERENCE',
    pattern: /(?:(?:^|[.!?\n])\s*)(Returning\s+to\s+your\s+(?:earlier|previous|initial)\s+(?:point|question|prompt)[,:]?\s*)/gi,
    confidence: 0.92,
    explanation: 'Conversational callback referring to an earlier prompt turn.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational callback.',
      replacement: '',
    }),
  }
];
