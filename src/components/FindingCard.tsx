import React, { useState } from 'react';
import { Finding, CATEGORY_LABELS } from '../detector/types';
import { Trash2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
  onRemove: (id: string) => void;
  onIgnoreOnce: (id: string) => void;
  onIgnorePhrase: (phrase: string) => void;
  onDisableCategory: (category: Finding['category']) => void;
  isRemoved: boolean;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  onRemove,
  onIgnoreOnce,
  onIgnorePhrase,
  onDisableCategory,
  isRemoved,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const categoryMeta = CATEGORY_LABELS[finding.category] || {
    label: finding.category,
    description: 'Conversational phrasing pattern.',
  };

  if (isRemoved) {
    return (
      <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
        <span className="line-through text-zinc-500 truncate mr-2">
          &ldquo;{finding.matchedText}&rdquo;
        </span>
        <button
          onClick={() => onRemove(finding.id)}
          className="text-xs font-semibold text-white hover:underline flex items-center gap-1 shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-950 space-y-2.5">
      {/* Category Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-300">
          {categoryMeta.label}
        </span>
      </div>

      {/* Matched excerpt */}
      <div className="p-2.5 rounded bg-black border-l-2 border-white text-xs text-zinc-200 break-words leading-relaxed">
        &ldquo;{finding.matchedText}&rdquo;
      </div>

      {/* Actions */}
      <div className="pt-2 flex items-center justify-between border-t border-zinc-900">
        <button
          type="button"
          onClick={() => onRemove(finding.id)}
          className="px-3 py-1.5 rounded bg-white text-black hover:bg-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          Options {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Minimal dropdown options if user needs them */}
      {showDetails && (
        <div className="pt-2 border-t border-zinc-900 space-y-1 text-xs">
          <button
            type="button"
            onClick={() => onIgnoreOnce(finding.id)}
            className="w-full text-left py-1 text-zinc-400 hover:text-white transition-colors"
          >
            Ignore this finding
          </button>
          <button
            type="button"
            onClick={() => onIgnorePhrase(finding.matchedText)}
            className="w-full text-left py-1 text-zinc-400 hover:text-white transition-colors"
          >
            Always ignore phrase &ldquo;{finding.matchedText.substring(0, 20)}...&rdquo;
          </button>
          <button
            type="button"
            onClick={() => onDisableCategory(finding.category)}
            className="w-full text-left py-1 text-zinc-400 hover:text-white transition-colors"
          >
            Disable category &ldquo;{categoryMeta.label}&rdquo;
          </button>
        </div>
      )}
    </div>
  );
};
