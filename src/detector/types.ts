export type ArtifactCategory =
  | 'ASSISTANT_FRAMING'
  | 'OFFER_TO_CONTINUE'
  | 'META_COMMENTARY'
  | 'CONVERSATIONAL_ACKNOWLEDGMENT'
  | 'AI_STYLE_CLOSING'
  | 'PREVIOUS_CONVERSATION_REFERENCE'
  | 'NORMAL_PROSE'
  | 'BORDERLINE';

export interface Finding {
  id: string;
  start: number;
  end: number;
  category: ArtifactCategory;
  confidence: number; // 0.0 - 1.0
  explanation: string;
  suggestion: string;
  matchedText: string;
  sourceLayer: 'rule' | 'classifier' | 'hybrid';
  ruleId?: string;
  replacement?: string;
}

export interface DetectionOptions {
  disabledCategories?: ArtifactCategory[];
  ignoredPhrases?: string[];
  minConfidence?: number;
  enableClassifier?: boolean;
}

export interface RulePattern {
  id: string;
  category: ArtifactCategory;
  pattern: RegExp;
  confidence: number;
  explanation: string;
  /**
   * Suggestion function or template.
   * If returns empty string, recommends complete removal of conversational artifact.
   * If returns string, recommends replacing matched segment.
   */
  generateSuggestion?: (match: RegExpExecArray, fullText: string) => {
    suggestion: string;
    replacement: string;
  };
  contextCondition?: (match: RegExpExecArray, fullText: string) => boolean;
}

export interface ClassifierModel {
  name: string;
  version: string;
  classify(sentence: string): {
    category: ArtifactCategory;
    confidence: number;
    probabilities: Record<ArtifactCategory, number>;
  };
}

export interface ScanResult {
  originalText: string;
  findings: Finding[];
  cleanedText: string;
  scannedAt: number;
}

export interface ExtensionSettings {
  disabledCategories: ArtifactCategory[];
  ignoredPhrases: string[];
  minConfidenceThreshold: number;
  enableLocalClassifier: boolean;
  theme: 'system' | 'light' | 'dark';
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
  disabledCategories: [],
  ignoredPhrases: [],
  minConfidenceThreshold: 0.65,
  enableLocalClassifier: true,
  theme: 'system',
};

export const CATEGORY_LABELS: Record<ArtifactCategory, { label: string; description: string; color: string }> = {
  ASSISTANT_FRAMING: {
    label: 'Assistant framing',
    description: 'Resembles conversational lead-in or preamble from an AI assistant before presenting the answer.',
    color: 'orange',
  },
  OFFER_TO_CONTINUE: {
    label: 'Offer to continue',
    description: 'Resembles an assistant offering additional follow-up help or further explanations.',
    color: 'blue',
  },
  META_COMMENTARY: {
    label: 'Meta-commentary',
    description: 'Commentary about the writing process, format changes, or code snippets rather than the content itself.',
    color: 'purple',
  },
  CONVERSATIONAL_ACKNOWLEDGMENT: {
    label: 'Conversational acknowledgment',
    description: 'Unnecessary conversational pleasantry or affirmative conversational opening.',
    color: 'pink',
  },
  AI_STYLE_CLOSING: {
    label: 'Conversational closing',
    description: 'Resembles assistant sign-off pleasantries ("Hope this helps!", "Feel free to reach out").',
    color: 'cyan',
  },
  PREVIOUS_CONVERSATION_REFERENCE: {
    label: 'Prior turn reference',
    description: 'References to a preceding prompt, previous turn, or conversational dialogue that are out of place in standalone writing.',
    color: 'yellow',
  },
  NORMAL_PROSE: {
    label: 'Normal prose',
    description: 'Natural writing with no detected conversational artifacts.',
    color: 'emerald',
  },
  BORDERLINE: {
    label: 'Borderline phrasing',
    description: 'Phrasing that may be intentional author voice or a minor conversational remnant.',
    color: 'slate',
  },
};
