import { RulePattern } from '../types';

export const metaCommentaryRules: RulePattern[] = [
  {
    id: 'meta-as-an-ai',
    category: 'META_COMMENTARY',
    pattern: /(?:(?:^|[.!?\n])\s*)(As\s+(?:an?\s+)?(?:AI|language\s+model|assistant)[^.!?\n]*[.!?]?)/gi,
    confidence: 0.99,
    explanation: 'Explicit meta-statement identifying as an AI assistant.',
    generateSuggestion: () => ({
      suggestion: 'Remove self-referential AI statement.',
      replacement: '',
    }),
  },
  {
    id: 'meta-revised-version-based-on-feedback',
    category: 'META_COMMENTARY',
    pattern: /(?:(?:^|[.!?\n])\s*)(Here\s+is\s+the\s+(?:revised|updated|edited|polished)\s+version(?:\s+incorporating\s+your\s+(?:changes|feedback|notes)|with\s+the\s+requested\s+tone\s+adjustments)?[^:\n.!?]*[:,]?)/gi,
    confidence: 0.95,
    explanation: 'Meta-commentary about the editing transaction between prompt and response.',
    generateSuggestion: () => ({
      suggestion: 'Remove editorial transition.',
      replacement: '',
    }),
  },
  {
    id: 'meta-in-the-revised-draft',
    category: 'META_COMMENTARY',
    pattern: /(?:(?:^|[.!?\n])\s*)(In\s+the\s+(?:revised|updated|edited)\s+(?:draft|version|response)(?:\s+below)?,?\s+I\s+[^.!?\n]*[.!?]?)/gi,
    confidence: 0.93,
    explanation: 'First-person editorial note describing modifications made to the text.',
    generateSuggestion: () => ({
      suggestion: 'Remove editorial preface.',
      replacement: '',
    }),
  },
  {
    id: 'meta-note-in-code-above',
    category: 'META_COMMENTARY',
    pattern: /(?:(?:^|[.!?\n])\s*)(Note\s+that\s+in\s+the\s+(?:code(?:\s+snippet)?|snippet|example(?:\s+provided)?|table|list)\s+above,?\s+[^.!?\n]*[.!?]?)/gi,
    confidence: 0.88,
    explanation: 'Conversational guide directing attention to generated artifacts above.',
    generateSuggestion: () => ({
      suggestion: 'Integrate directly into prose without conversational meta-framing.',
      replacement: '',
    }),
  },
  {
    id: 'meta-replace-with-your-own',
    category: 'META_COMMENTARY',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:(?:Please\s+)?(?:make\s+sure\s+to|be\s+sure\s+to|remember\s+to)|Please)\s+replace\s+[^.!?\n]*with\s+your\s+(?:own\s+)?actual\s+[^.!?\n]*[.!?]?)/gi,
    confidence: 0.92,
    explanation: 'Instructional assistant note reminding user to substitute placeholder values.',
    generateSuggestion: () => ({
      suggestion: 'Remove assistant placeholder instruction.',
      replacement: '',
    }),
  },
  {
    id: 'meta-summary-of-changes',
    category: 'META_COMMENTARY',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:(?:Here\s+is\s+a\s+)?summary\s+of\s+(?:key\s+)?changes\s+(?:I\s+made|made\s+to\s+the\s+text)|Summary\s+of\s+changes\s+made\s+to\s+the\s+text)[^:\n.!?]*[:,]?)/gi,
    confidence: 0.94,
    explanation: 'Assistant meta-summary describing changes made during the prompt exchange.',
    generateSuggestion: () => ({
      suggestion: 'Remove editorial changelog preamble.',
      replacement: '',
    }),
  }
];
