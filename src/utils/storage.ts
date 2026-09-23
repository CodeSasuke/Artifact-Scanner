import { ExtensionSettings, DEFAULT_SETTINGS, ScanResult } from '../detector/types';

const SETTINGS_KEY = 'artifact_scanner_settings';
const LAST_SCAN_KEY = 'artifact_scanner_last_scan';

export async function getSettings(): Promise<ExtensionSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const data = await chrome.storage.local.get(SETTINGS_KEY);
      return { ...DEFAULT_SETTINGS, ...(data[SETTINGS_KEY] || {}) };
    }
  } catch (e) {
    console.warn('Chrome storage unavailable, using default settings', e);
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
    }
  } catch (e) {
    console.warn('Failed to save settings to chrome.storage', e);
  }
}

export async function saveLastScan(scan: ScanResult): Promise<void> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ [LAST_SCAN_KEY]: scan });
    }
  } catch (e) {
    console.warn('Failed to save last scan', e);
  }
}

export async function getLastScan(): Promise<ScanResult | null> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const data = await chrome.storage.local.get(LAST_SCAN_KEY);
      return data[LAST_SCAN_KEY] || null;
    }
  } catch (e) {
    console.warn('Failed to retrieve last scan', e);
  }
  return null;
}
