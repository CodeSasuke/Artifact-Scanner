import React from 'react';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings?: () => void;
  onNewScan?: () => void;
  hasScan?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onNewScan, hasScan }) => {
  return (
    <header className="flex items-center justify-between pb-3 border-b border-zinc-800 bg-black">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-bold text-white tracking-tight">
          Artifact Scanner
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {hasScan && onNewScan && (
          <button
            type="button"
            onClick={onNewScan}
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded border border-zinc-800 hover:border-zinc-700"
          >
            New scan
          </button>
        )}
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
