import React, { useState, useEffect } from 'react';
import { ScanResult, ArtifactCategory } from '../detector/types';
import { DetectionPipeline } from '../detector/pipeline/detectionPipeline';
import { Header } from '../components/Header';
import { FindingCard } from '../components/FindingCard';
import { getLastScan, saveLastScan, getSettings, saveSettings } from '../utils/storage';
import { readClipboardText, copyTextToClipboard } from '../utils/clipboard';
import { Check, Copy, Clipboard, ArrowRight, ExternalLink } from 'lucide-react';

export const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [removedFindingIds, setRemovedFindingIds] = useState<Set<string>>(new Set());
  const [ignoredFindingIds, setIgnoredFindingIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    getLastScan().then(saved => {
      if (saved && saved.originalText) {
        setScanResult(saved);
        setInputText(saved.originalText);
        setRemovedFindingIds(new Set(saved.findings.map(f => f.id)));
      }
    });
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

  const openSidepanel = () => {
    if (chrome.sidePanel) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          chrome.sidePanel.open({ tabId: tab.id }).catch(() => {
            if (tab?.windowId) chrome.sidePanel.open({ windowId: tab.windowId });
          });
          window.close();
        }
      });
    }
  };

  const openSettings = () => {
    chrome.runtime?.openOptionsPage?.();
  };

  const visibleFindings = scanResult
    ? scanResult.findings.filter(f => !ignoredFindingIds.has(f.id))
    : [];

  const activeRemovals = visibleFindings.filter(f => removedFindingIds.has(f.id));
  const currentCleanedText = scanResult
    ? DetectionPipeline.applyCleanup(scanResult.originalText, activeRemovals)
    : '';

  return (
    <div className="w-[380px] max-h-[580px] overflow-y-auto bg-black text-white flex flex-col p-4 space-y-3.5 font-sans antialiased selection:bg-white selection:text-black">
      <Header
        onOpenSettings={openSettings}
        onNewScan={() => setScanResult(null)}
        hasScan={!!scanResult}
      />

      {statusMessage && (
        <div className="p-2 rounded bg-zinc-900 border border-zinc-700 text-xs font-medium text-white flex items-center gap-1.5">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Input Mode */}
      {!scanResult ? (
        <div className="space-y-2.5">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste text to scan..."
            className="w-full h-24 p-3 text-xs font-mono rounded-lg bg-zinc-950 border border-zinc-800 focus:border-white outline-none text-white placeholder-zinc-600 resize-none"
            autoFocus
          />
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => handleScanText(inputText)}
              disabled={!inputText.trim()}
              className="w-full py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-30 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Scan Text</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleScanClipboard}
              className="w-full py-2 rounded-lg bg-transparent text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste from Clipboard</span>
            </button>
          </div>
        </div>
      ) : (
        /* Results Mode */
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-900 text-xs">
            <span className="font-bold text-white uppercase tracking-wider">
              {visibleFindings.length === 0 ? '0 artifacts' : `${visibleFindings.length} artifact${visibleFindings.length === 1 ? '' : 's'}`}
            </span>
            {removedFindingIds.size > 0 && (
              <button
                type="button"
                onClick={() => setRemovedFindingIds(new Set())}
                className="text-zinc-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyCleaned}
            disabled={!currentCleanedText}
            className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              copied
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>Copy Cleaned Text</span>
              </>
            )}
          </button>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 space-y-1">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Cleaned Output
            </div>
            <div className="text-xs font-mono text-zinc-100 whitespace-pre-wrap max-h-28 overflow-y-auto leading-relaxed">
              {currentCleanedText}
            </div>
          </div>

          {visibleFindings.length > 0 && (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
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
          )}
        </div>
      )}

      {/* Side panel link */}
      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
        <span>Side panel</span>
        <button
          type="button"
          onClick={openSidepanel}
          className="text-white hover:underline font-semibold flex items-center gap-1 transition-colors"
        >
          Open
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
