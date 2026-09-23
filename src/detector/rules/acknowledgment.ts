import { RulePattern } from '../types';

export const acknowledgmentRules: RulePattern[] = [
  {
    id: 'ack-sure-happy-to',
    category: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Sure(?:\s+thing)?|Certainly|Of\s+course|Absolutely|Gladly|Understood)!\s*(?:I(?:['’]d|\s+would)?\s+(?:be\s+happy\s+to|can\s+help\s+you\s+with|will\s+outline|can\s+walk\s+you\s+through)|Let(?:['’]s|\s+us)|Below|Here)[^.!?\n]*[.!?:]?)/gi,
    confidence: 0.98,
    explanation: 'Conversational affirmative acknowledgment commonly output by chat assistants before beginning an answer.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational affirmation.',
      replacement: '',
    }),
  },
  {
    id: 'ack-great-question',
    category: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Great|Excellent|Good|Interesting|Fantastic)\s+question[!.]?\s*(?:Here\s+(?:is|are)|To\s+understand|Let['’]?s|The\s+difference)?[^.!?\n]*[.!?]?)/gi,
    confidence: 0.94,
    explanation: 'Conversational validation praise ("Great question!") typical of interactive dialogue.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational praise.',
      replacement: '',
    }),
  },
  {
    id: 'ack-standalone-sure-certainly',
    category: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    pattern: /(?:(?:^|[.!?\n])\s*)((?:Sure(?:\s+thing)?|Certainly|Absolutely|Of\s+course|Understood|No\s+problem)[!,]\s*(?:here['’]?s|here\s+is|let['’]?s\s+look\s+at|below\s+is)[^:\n.!?]*[:,]?)/gi,
    confidence: 0.95,
    explanation: 'Conversational opener affirming the prompt before delivering text.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational opener.',
      replacement: '',
    }),
  },
  {
    id: 'ack-happy-to-assist',
    category: 'CONVERSATIONAL_ACKNOWLEDGMENT',
    pattern: /(?:(?:^|[.!?\n])\s*)(I\s+am\s+(?:happy|glad|delighted)\s+to\s+assist\s+you\s+with\s+(?:this|that|your\s+request)[^.!?\n]*[.!?]?)/gi,
    confidence: 0.93,
    explanation: 'Direct assistant acknowledgment of assistance.',
    generateSuggestion: () => ({
      suggestion: 'Remove conversational greeting.',
      replacement: '',
    }),
  },
];
