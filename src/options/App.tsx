import React, { useState, useEffect } from 'react';
import { ExtensionSettings, DEFAULT_SETTINGS, CATEGORY_LABELS, ArtifactCategory } from '../detector/types';
import { getSettings, saveSettings } from '../utils/storage';
import {
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  ListFilter,
  EyeOff,
  Sparkles
} from 'lucide-react';

type SettingsTab = 'categories' | 'ignored';

const CATEGORY_EXAMPLES: Record<ArtifactCategory, string> = {
  ASSISTANT_FRAMING: '“Here is a clear and simple explanation of...”',
  OFFER_TO_CONTINUE: '“If you want, I can also explain columns or primary keys.”',
  META_COMMENTARY: '“Note that in the code snippet above, the timeout is...”',
  CONVERSATIONAL_ACKNOWLEDGMENT: '“Sure! I’d be happy to help you with that.”',
  AI_STYLE_CLOSING: '“I hope this helps! Feel free to ask if you have questions.”',
  PREVIOUS_CONVERSATION_REFERENCE: '“As we discussed earlier in our previous chat...”',
  NORMAL_PROSE: 'Natural writing without conversational remnants.',
  BORDERLINE: '“Without further ado, let’s examine the candidate files.”',
};

export const App: React.FC = () => {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<SettingsTab>('categories');
  const [newPhrase, setNewPhrase] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getSettings().then(loaded => setSettings(loaded));
  }, []);

  const handleUpdate = async (updated: ExtensionSettings) => {
    setSettings(updated);
    await saveSettings(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggleCategory = (cat: ArtifactCategory) => {
    const isCurrentlyDisabled = settings.disabledCategories.includes(cat);
    const updatedCategories = isCurrentlyDisabled
      ? settings.disabledCategories.filter(c => c !== cat)
      : [...settings.disabledCategories, cat];

    handleUpdate({
      ...settings,
      disabledCategories: updatedCategories,
    });
  };

  const enableAllCategories = () => {
    handleUpdate({
      ...settings,
      disabledCategories: [],
    });
  };

  const disableAllCategories = () => {
    handleUpdate({
      ...settings,
      disabledCategories: [...allCategories],
    });
  };

  const addIgnoredPhrase = () => {
    const trimmed = newPhrase.trim().toLowerCase();
    if (!trimmed || settings.ignoredPhrases.includes(trimmed)) return;

    handleUpdate({
      ...settings,
      ignoredPhrases: [...settings.ignoredPhrases, trimmed],
    });
    setNewPhrase('');
  };

  const removeIgnoredPhrase = (phraseToRemove: string) => {
    handleUpdate({
      ...settings,
      ignoredPhrases: settings.ignoredPhrases.filter(p => p !== phraseToRemove),
    });
  };

  const resetDefaults = () => {
    handleUpdate(DEFAULT_SETTINGS);
  };

  const allCategories: ArtifactCategory[] = [
    'ASSISTANT_FRAMING',
    'OFFER_TO_CONTINUE',
    'META_COMMENTARY',
    'CONVERSATIONAL_ACKNOWLEDGMENT',
    'AI_STYLE_CLOSING',
    'PREVIOUS_CONVERSATION_REFERENCE',
    'BORDERLINE',
  ];

  const activeCategoryCount = allCategories.length - settings.disabledCategories.length;

  return (
    <div className="min-h-screen bg-black text-white antialiased font-sans flex flex-col selection:bg-white selection:text-black">
      {/* Top Application Bar */}
      <header className="border-b border-zinc-800 bg-black sticky top-0 z-30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 fill-black" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">
                Artifact Scanner Settings
              </h1>
              <p className="text-xs text-zinc-400">
                Detection rules and ignored phrases
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-white flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={resetDefaults}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 border border-zinc-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="md:col-span-4 space-y-1">
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'categories'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ListFilter className="w-4 h-4" />
                <span>Detection Rules</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTab === 'categories' ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {activeCategoryCount}/{allCategories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ignored')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                activeTab === 'ignored'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4" />
                <span>Ignored Phrases</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                activeTab === 'ignored' ? 'bg-zinc-200 text-black' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {settings.ignoredPhrases.length}
              </span>
            </button>
          </nav>
        </aside>

        {/* Right Tab Content */}
        <main className="md:col-span-8 space-y-5">
          {/* TAB 1: CATEGORIES & RULES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Detection Categories
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={enableAllCategories}
                    className="text-white hover:underline font-semibold"
                  >
                    Enable all
                  </button>
                  <span className="text-zinc-600">•</span>
                  <button
                    type="button"
                    onClick={disableAllCategories}
                    className="text-zinc-400 hover:text-white"
                  >
                    Disable all
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {allCategories.map(cat => {
                  const meta = CATEGORY_LABELS[cat];
                  const isEnabled = !settings.disabledCategories.includes(cat);
                  const example = CATEGORY_EXAMPLES[cat];

                  return (
                    <div
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                        isEnabled
                          ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                          : 'bg-black border-zinc-900 opacity-50'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {meta.label}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-normal">
                          {meta.description}
                        </p>
                        {example && (
                          <div className="pt-0.5">
                            <span className="text-[11px] font-mono text-zinc-300 bg-black px-2 py-0.5 rounded border border-zinc-800 inline-block">
                              {example}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Monochrome Switch Toggle */}
                      <div className="pt-1">
                        <div
                          className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-150 ${
                            isEnabled ? 'bg-white' : 'bg-zinc-800'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full shadow-sm transform transition-transform duration-150 ${
                              isEnabled ? 'bg-black translate-x-5' : 'bg-zinc-500 translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: IGNORED PHRASES */}
          {activeTab === 'ignored' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-zinc-800">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Ignored Phrases
                </h2>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPhrase}
                  onChange={e => setNewPhrase(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addIgnoredPhrase()}
                  placeholder="Type an expression to ignore..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg bg-zinc-950 border border-zinc-800 focus:border-white outline-none text-white placeholder-zinc-600 font-sans"
                />
                <button
                  type="button"
                  onClick={addIgnoredPhrase}
                  disabled={!newPhrase.trim()}
                  className="px-4 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 min-h-[120px] flex flex-wrap gap-2 items-start content-start">
                {settings.ignoredPhrases.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center w-full">No phrases currently ignored.</p>
                ) : (
                  settings.ignoredPhrases.map(phrase => (
                    <span
                      key={phrase}
                      className="px-2.5 py-1 rounded bg-black border border-zinc-800 text-xs font-mono text-white flex items-center gap-2"
                    >
                      <span>&ldquo;{phrase}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => removeIgnoredPhrase(phrase)}
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
