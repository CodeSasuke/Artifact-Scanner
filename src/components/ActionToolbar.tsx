import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Clipboard } from 'lucide-react';
import { copyTextToClipboard } from '../utils/clipboard';
import { countWords } from '../utils/textUtils';

interface ActionToolbarProps {
  findingsCount: number;
  cleanedText: string;
  originalText: string;
  hasRemovals: boolean;
  onUndoAll: () => void;
  onScanClipboard: () => void;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  findingsCount,
  cleanedText,
  originalText,
  hasRemovals,
  onUndoAll,
  onScanClipboard,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!cleanedText) return;
    const success = await copyTextToClipboard(cleanedText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const originalWords = countWords(originalText);
  const cleanedWords = countWords(cleanedText);

  return (
    <div className="space-y-3">
      {/* Findings Count Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">
          {findingsCount === 0 ? (
            <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              Clean text — 0 artifacts detected
            </span>
          ) : (
            <span>
              <strong className="text-amber-400 font-black text-base">{findingsCount}</strong> possible {findingsCount === 1 ? 'artifact' : 'artifacts'} found
            </span>
          )}
        </span>

        <div className="flex items-center gap-3">
          {findingsCount > 0 && originalWords > 0 && (
            <span className="text-xs font-mono font-bold text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">
              {originalWords} → {cleanedWords} words
            </span>
          )}
          {hasRemovals && (
            <button
              type="button"
              onClick={onUndoAll}
              className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* Primary Actions Row */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!cleanedText}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              Copied Cleaned Text!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 stroke-[2.5]" />
              Copy Cleaned Text
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onScanClipboard}
          className="py-2.5 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold border-2 border-zinc-700 flex items-center gap-2 transition-colors shadow-sm"
          title="Scan text currently in clipboard"
        >
          <Clipboard className="w-4 h-4 text-blue-400 stroke-[2.5]" />
          Scan Clipboard
        </button>
      </div>
    </div>
  );
};
