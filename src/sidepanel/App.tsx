import React, { useState, useEffect } from 'react';
import { ScanResult, ArtifactCategory } from '../detector/types';
import { DetectionPipeline } from '../detector/pipeline/detectionPipeline';
import { Header } from '../components/Header';
import { FindingCard } from '../components/FindingCard';
import { getLastScan, saveLastScan, getSettings, saveSettings } from '../utils/storage';
import { readClipboardText, copyTextToClipboard } from '../utils/clipboard';
import { Check, Copy, Clipboard, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [removedFindingIds, setRemovedFindingIds] = useState<Set<string>>(new Set());
  const [ignoredFindingIds, setIgnoredFindingIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load last scan on mount and listen for background broadcasts
  useEffect(() => {
    getLastScan().then(saved => {
      if (saved && saved.originalText) {
        setScanResult(saved);
        setInputText(saved.originalText);
        setRemovedFindingIds(new Set(saved.findings.map(f => f.id)));
      }
    });

    const messageListener = (message: any) => {
      if (message.type === 'NEW_SCAN_RESULT' && message.payload) {
        const result: ScanResult = message.payload;
        setScanResult(result);
        setInputText(result.originalText);
        setRemovedFindingIds(new Set(result.findings.map(f => f.id)));
        setIgnoredFindingIds(new Set());
        setIsEditing(false);
      }
    };

    const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes['artifact_scanner_last_scan']?.newValue) {
        const result: ScanResult = changes['artifact_scanner_last_scan'].newValue;
        setScanResult(result);
        setInputText(result.originalText);
        setRemovedFindingIds(new Set(result.findings.map(f => f.id)));
        setIgnoredFindingIds(new Set());
        setIsEditing(false);
      }
    };

    chrome.runtime?.onMessage?.addListener(messageListener);
    chrome.storage?.onChanged?.addListener(storageListener);
    return () => {
      chrome.runtime?.onMessage?.removeListener(messageListener);
      chrome.storage?.onChanged?.removeListener(storageListener);
    };
  }, []);

  const handleScanText = async (textToScan: string) => {
    if (!textToScan.trim()) return;
    const settings = await getSettings();
    const result = DetectionPipeline.scan(textToScan, {
      disabledCategories: settings.disabledCategories,
      ignoredPhrases: settings.ignoredPhrases,
      minConfidence: settings.minConfidenceThreshold,
      enableClassifier: settings.enableLocalClassifier,
    });

    setScanResult(result);
    setInputText(textToScan);
    setRemovedFindingIds(new Set(result.findings.map(f => f.id)));
    setIgnoredFindingIds(new Set());
    setIsEditing(false);
    await saveLastScan(result);
  };

  const handleScanClipboard = async () => {
    try {
      const text = await readClipboardText();
      if (!text || !text.trim()) {
        setStatusMessage('Clipboard is empty.');
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
      await handleScanText(text);
    } catch {
      setStatusMessage('Clipboard access denied.');
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  const toggleRemove = (id: string) => {
    setRemovedFindingIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleIgnoreOnce = (id: string) => {
    setIgnoredFindingIds(prev => new Set([...prev, id]));
    setRemovedFindingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleIgnorePhrase = async (phrase: string) => {
    const settings = await getSettings();
    const updatedPhrases = Array.from(new Set([...settings.ignoredPhrases, phrase.toLowerCase().trim()]));
    await saveSettings({ ...settings, ignoredPhrases: updatedPhrases });
    setStatusMessage(`Ignored phrase.`);
    setTimeout(() => setStatusMessage(null), 2500);
    if (inputText) await handleScanText(inputText);
  };

  const handleDisableCategory = async (category: ArtifactCategory) => {
    const settings = await getSettings();
    const updatedCategories = Array.from(new Set([...settings.disabledCategories, category]));
    await saveSettings({ ...settings, disabledCategories: updatedCategories });
    setStatusMessage(`Disabled category.`);
    setTimeout(() => setStatusMessage(null), 2500);
    if (inputText) await handleScanText(inputText);
  };

  const handleCopyCleaned = async () => {
    if (!currentCleanedText) return;
    const success = await copyTextToClipboard(currentCleanedText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewScan = () => {
    setScanResult(null);
    setInputText('');
    setIsEditing(true);
  };

  const openSettings = () => {
    chrome.runtime?.openOptionsPage?.();
  };

  // Active findings not ignored
  const visibleFindings = scanResult
    ? scanResult.findings.filter(f => !ignoredFindingIds.has(f.id))
    : [];

  const activeRemovals = visibleFindings.filter(f => removedFindingIds.has(f.id));
  const currentCleanedText = scanResult
    ? DetectionPipeline.applyCleanup(scanResult.originalText, activeRemovals)
    : '';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 space-y-4 antialiased selection:bg-white selection:text-black">
      <Header
        onOpenSettings={openSettings}
        onNewScan={handleNewScan}
        hasScan={!!scanResult}
      />

      {statusMessage && (
        <div className="p-2.5 rounded bg-zinc-900 border border-zinc-700 text-xs font-medium text-white flex items-center gap-2">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* When no scan has been done, or when user clicks New Scan: show minimal input */}
      {(!scanResult || isEditing) ? (
        <div className="space-y-3 flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="space-y-1 text-center">
            <h2 className="text-sm font-bold text-white">Scan Text</h2>
            <p className="text-xs text-zinc-400">Paste text below or scan your clipboard.</p>
          </div>

          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste text to scan for conversational artifacts..."
            className="w-full h-36 p-3 text-xs font-mono rounded-lg bg-zinc-950 border border-zinc-800 focus:border-white outline-none text-white placeholder-zinc-600 resize-none"
            autoFocus
          />

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleScanText(inputText)}
              disabled={!inputText.trim()}
              className="w-full py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-30 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Scan Text</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleScanClipboard}
              className="w-full py-2 rounded-lg bg-transparent text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste from Clipboard</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results View: Clean, direct, no duplicated textboxes or redundant buttons */
        <div className="space-y-4 flex-1 flex flex-col">
          {/* Header Summary */}
          <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {visibleFindings.length === 0 ? (
                '0 artifacts found'
              ) : (
                `${visibleFindings.length} artifact${visibleFindings.length === 1 ? '' : 's'} found`
              )}
            </span>

            {removedFindingIds.size > 0 && (
              <button
                type="button"
                onClick={() => setRemovedFindingIds(new Set())}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Reset all
              </button>
            )}
          </div>

          {/* Primary Action Button (Copy Cleaned Text) */}
          <button
            type="button"
            onClick={handleCopyCleaned}
            disabled={!currentCleanedText}
            className={`w-full py-3 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              copied
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>Copy Cleaned Text</span>
              </>
            )}
          </button>

          {/* Cleaned Result Preview */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Cleaned Output
            </div>
            <div className="text-xs font-mono text-zinc-100 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {currentCleanedText || <span className="text-zinc-600 italic">No output text</span>}
            </div>
          </div>

          {/* Findings List */}
          {visibleFindings.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                Flagged Remnants
              </div>
              <div className="space-y-2.5">
                {visibleFindings.map(finding => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    onRemove={toggleRemove}
                    onIgnoreOnce={handleIgnoreOnce}
                    onIgnorePhrase={handleIgnorePhrase}
                    onDisableCategory={handleDisableCategory}
                    isRemoved={!removedFindingIds.has(finding.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
