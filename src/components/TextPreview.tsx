import React, { useState } from 'react';
import { Finding } from '../detector/types';

interface TextPreviewProps {
  originalText: string;
  cleanedText: string;
  findings: Finding[];
  removedFindingIds: Set<string>;
}

export const TextPreview: React.FC<TextPreviewProps> = ({
  originalText,
  cleanedText,
  findings,
  removedFindingIds,
}) => {
  const [viewMode, setViewMode] = useState<'diff' | 'cleaned' | 'original'>('cleaned');

  if (!originalText) return null;

  return (
    <div className="rounded-xl border-2 border-zinc-700 bg-[#141418] overflow-hidden text-xs shadow-md">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b-2 border-zinc-700 bg-[#1a1a20]">
        <span className="font-extrabold text-white text-xs uppercase tracking-wider">Text Preview</span>
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode('cleaned')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'cleaned' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-300 hover:text-white'
              }`}
          >
            Cleaned
          </button>
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'diff' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-300 hover:text-white'
              }`}
          >
            Highlights
          </button>
          <button
            type="button"
            onClick={() => setViewMode('original')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${viewMode === 'original' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-300 hover:text-white'
              }`}
          >
            Original
          </button>
        </div>
      </div>

      <div className="p-3.5 max-h-48 overflow-y-auto font-mono text-xs font-medium leading-relaxed break-words whitespace-pre-wrap text-zinc-100">
        {viewMode === 'cleaned' && (
          cleanedText ? cleanedText : <span className="text-zinc-500 italic">No text content</span>
        )}

        {viewMode === 'original' && (
          originalText
        )}

        {viewMode === 'diff' && (
          <RenderHighlighted
            text={originalText}
            findings={findings}
            removedFindingIds={removedFindingIds}
          />
        )}
      </div>
    </div>
  );
};

const RenderHighlighted: React.FC<{
  text: string;
  findings: Finding[];
  removedFindingIds: Set<string>;
}> = ({ text, findings, removedFindingIds }) => {
  if (findings.length === 0) return <span>{text}</span>;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  findings.forEach((finding, idx) => {
    // Text before match
    if (finding.start > lastIndex) {
      elements.push(
        <span key={`text-${idx}`}>{text.substring(lastIndex, finding.start)}</span>
      );
    }

    const isRemoved = removedFindingIds.has(finding.id);
    elements.push(
      <mark
        key={`match-${finding.id}`}
        className={`px-1.5 py-0.5 rounded font-bold transition-all ${isRemoved
            ? 'bg-rose-500/25 text-rose-300 line-through decoration-rose-400 border border-rose-500/40'
            : 'bg-amber-400/25 text-amber-200 border-b-2 border-amber-400'
          }`}
        title={`${finding.category}: ${finding.explanation}`}
      >
        {finding.matchedText}
      </mark>
    );

    lastIndex = finding.end;
  });

  if (lastIndex < text.length) {
    elements.push(<span key="text-end">{text.substring(lastIndex)}</span>);
  }

  return <>{elements}</>;
};
