import { RulePattern } from '../types';

export const assistantFramingRules: RulePattern[] = [
  {
    id: 'framing-here-is-explanation',
    category: 'ASSISTANT_FRAMING',
    // Matches "Here/Below is/are a (detailed/concise) breakdown/overview/guide/tips/list/summary of/on/for/to..."
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Here|Below)\s+(?:is|are)\s+(?:a\s+|an\s+|the\s+|a\s+few\s+)?(?:clear\s+(?:and\s+simple\s+)?)?(?:quick\s+|brief\s+|detailed\s+|comprehensive\s+|concise\s+|practical\s+)?(?:overview|summary|explanation|breakdown|guide|introduction|example|list|comparison|draft|version|tips|steps|recommendations|pointers)\s+(?:of|on|for|to)\s+[^:\n.!?]+:?)/gi,
    confidence: 0.94,
    explanation: 'Resembles an assistant introducing an answer rather than standalone writing.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational preamble to jump directly into the content.',
      replacement: '',
    }),
  },
  {
    id: 'framing-certainly-below-is',
    category: 'ASSISTANT_FRAMING',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Certainly|Absolutely|Of\s+course)!\s*(?:Below|Here)\s+is\s+[^:\n.!?]+:?)/gi,
    confidence: 0.98,
    explanation: 'Contains assistant-style preamble affirming the prompt before delivering text.',
    generateSuggestion: () => ({
      suggestion: 'Delete introductory affirmation.',
      replacement: '',
    }),
  },
  {
    id: 'framing-to-answer-your-question',
    category: 'ASSISTANT_FRAMING',
    pattern: /(?:(?:^|[.!?\n])\s*)(To\s+(?:answer|address|respond\s+to)\s+your\s+(?:question|prompt|inquiry|request)[^:\n.!?]*[:,]?)/gi,
    confidence: 0.92,
    explanation: 'Conversational lead-in addressing a user inquiry instead of presenting direct prose.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational reference to the question.',
      replacement: '',
    }),
  },
  {
    id: 'framing-as-requested-here-is',
    category: 'ASSISTANT_FRAMING',
    pattern: /(?:(?:^|[.!?\n])\s*)(As\s+(?:you\s+)?requested,?\s*(?:here\s+is|below\s+is|I\s+have\s+provided)[^:\n.!?]*[:,]?)/gi,
    confidence: 0.93,
    explanation: 'Assistant confirmation acknowledging a request before providing the response.',
    generateSuggestion: () => ({
      suggestion: 'Remove lead-in clause.',
      replacement: '',
    }),
  },
  {
    id: 'framing-let-us-dive-in',
    category: 'ASSISTANT_FRAMING',
    pattern: /(?:(?:^|[.!?\n])\s*)(Let['’]?s\s+(?:dive|delve|jump)\s+(?:right\s+)?in(?:to\s+(?:the\s+details|this))?[!.:]?)/gi,
    confidence: 0.88,
    explanation: 'Conversational prompt transition typical of generated introductions.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational transition.',
      replacement: '',
    }),
  },
  {
    id: 'framing-in-this-section-i-will',
    category: 'ASSISTANT_FRAMING',
    pattern: /(?:(?:^|[.!?\n])\s*)(In\s+this\s+(?:response|section|reply),?\s+I\s+(?:will|shall)\s+(?:explain|detail|break\s+down|walk\s+you\s+through)[^.!?\n]*[.!?]?)/gi,
    confidence: 0.90,
    explanation: 'First-person assistant roadmap referencing "this response" or "this reply".',
    generateSuggestion: () => ({
      suggestion: 'Remove or replace with third-person expository framing.',
      replacement: '',
    }),
  },
  {
    id: 'framing-delve-into',
    category: 'ASSISTANT_FRAMING',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:(?:Sure|Certainly|Now|So|Well|Okay)[!,]?\s*)?Let['’]?s\s+(?:take\s+a\s+(?:closer\s+)?look\s+at|examine|explore|unpack|delve\s+into)\s+[^.!?\n]+[.!?]?)/gi,
    confidence: 0.92,
    explanation: 'Conversational rhetorical transition frequently seen in assistant explanations.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational segue.',
      replacement: '',
    }),
  }
];
