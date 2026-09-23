import { RulePattern } from '../types';

export const offerToContinueRules: RulePattern[] = [
  {
    id: 'offer-if-you-want-i-can',
    category: 'OFFER_TO_CONTINUE',
    // Matches "If you'd like/want/prefer, I can (also) [do anything]..."
    pattern: /(?:(?:^|[.!?\n])\s*)(If\s+you(?:['’]d|\s+would)?\s*(?:want|wish|like|prefer),?\s+I\s+(?:can|could)\s+(?:also\s+)?[a-z]+[^.!?\n]*[.!?]?)/gi,
    confidence: 0.95,
    explanation: 'Looks like an assistant offering additional help or follow-up explanations rather than finished prose.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational follow-up offer.',
      replacement: '',
    }),
  },
  {
    id: 'offer-i-can-also-if-you-like',
    category: 'OFFER_TO_CONTINUE',
    // Matches "I can also [verb] ... if you (would) like/prefer/wish"
    pattern: /(?:(?:^|[.!?\n])\s*)(I\s+can\s+(?:also\s+)?[a-z]+[^.!?\n]*\s+if\s+you\s+(?:would\s+|'d\s+)?(?:like|prefer|wish|want)[.!?]?)/gi,
    confidence: 0.94,
    explanation: 'Conversational offer suggesting additional content.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational follow-up offer.',
      replacement: '',
    }),
  },
  {
    id: 'offer-let-me-know-if-you-would-like',
    category: 'OFFER_TO_CONTINUE',
    pattern: /(?:(?:^|[.!?\n])\s*)(Let\s+me\s+know\s+if\s+you(?:['’]d|\s+would|\s+want|\s+wish|\s+like)(?:\s+me)?(?:\s+to)?\s+[^.!?\n]*[.!?]?)/gi,
    confidence: 0.96,
    explanation: 'Conversational offer inviting further user requests.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational closing offer.',
      replacement: '',
    }),
  },
  {
    id: 'offer-would-you-like-me-to',
    category: 'OFFER_TO_CONTINUE',
    pattern: /(?:(?:^|[.!?\n])\s*)(Would\s+you\s+like\s+me\s+to\s+[^.!?\n]*\??)/gi,
    confidence: 0.97,
    explanation: 'Direct question offering additional assistant generation.',
    generateSuggestion: () => ({
      suggestion: 'Remove assistant question.',
      replacement: '',
    }),
  },
  {
    id: 'offer-happy-to-help-with',
    category: 'OFFER_TO_CONTINUE',
    pattern: /(?:(?:^|[.!?\n])\s*)(I(?:['’]d|\s+would)?\s+be\s+(?:more\s+than\s+)?happy\s+to\s+[^.!?\n]*[.!?]?)/gi,
    confidence: 0.93,
    explanation: 'Polite assistant offer expressing willingness to continue assisting.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational offer.',
      replacement: '',
    }),
  },
  {
    id: 'offer-need-more-examples',
    category: 'OFFER_TO_CONTINUE',
    pattern: /(?:(?:^|[.!?\n])\s*)(If\s+you\s+need\s+(?:more|additional|further)\s+[^.!?\n]*?(?:just\s+)?(?:let\s+me\s+know|ask|feel\s+free)[^.!?\n]*[.!?]?)/gi,
    confidence: 0.94,
    explanation: 'Assistant prompt inviting additional queries.',
    generateSuggestion: () => ({
      suggestion: 'Remove follow-up invitation.',
      replacement: '',
    }),
  },
  {
    id: 'offer-we-can-also-explore',
    category: 'OFFER_TO_CONTINUE',
    pattern: /(?:(?:^|[.!?\n])\s*)(We\s+can\s+also\s+(?:explore|delve\s+into|examine|discuss)\s+[^.!?\n]*\s+if\s+you\s+(?:prefer|wish|want)[.!?]?)/gi,
    confidence: 0.89,
    explanation: 'Conversational suggestion offering alternative directions.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational suggestion.',
      replacement: '',
    }),
  },
];
