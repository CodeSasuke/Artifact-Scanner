import { DetectionPipeline } from '../detector/pipeline/detectionPipeline';
import { getSettings, saveLastScan } from '../utils/storage';

const CONTEXT_MENU_ID = 'scan-ai-artifacts';

chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for text selection
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Scan for AI artifacts',
    contexts: ['selection'],
  });

  console.log('Artifact Scanner extension installed successfully.');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && info.selectionText) {
    // 1. Immediately trigger sidePanel.open synchronously while the user gesture token is valid
    if (tab?.id && chrome.sidePanel) {
      chrome.sidePanel.open({ tabId: tab.id }).catch(() => {
        if (tab?.windowId) {
          chrome.sidePanel.open({ windowId: tab.windowId }).catch((err) => {
            console.warn('Side panel open error:', err);
          });
        }
      });
    }

    // 2. Perform scanning and save result
    const selectedText = info.selectionText;
    getSettings().then(settings => {
      const scanResult = DetectionPipeline.scan(selectedText, {
        disabledCategories: settings.disabledCategories,
        ignoredPhrases: settings.ignoredPhrases,
        minConfidence: settings.minConfidenceThreshold,
        enableClassifier: settings.enableLocalClassifier,
      });

      saveLastScan(scanResult).then(() => {
        // Broadcast scan result to any open sidepanel or popup
        chrome.runtime.sendMessage({
          type: 'NEW_SCAN_RESULT',
          payload: scanResult,
        }).catch(() => {
          // Receiver may still be loading; it will read from storage on mount
        });
      });
    });
  }
});

// Listen for runtime messages
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'SCAN_TEXT') {
    getSettings().then(settings => {
      const scanResult = DetectionPipeline.scan(message.text, {
        disabledCategories: settings.disabledCategories,
        ignoredPhrases: settings.ignoredPhrases,
        minConfidence: settings.minConfidenceThreshold,
        enableClassifier: settings.enableLocalClassifier,
      });
      saveLastScan(scanResult).then(() => {
        sendResponse({ success: true, scanResult });
      });
    });
    return true; // Keep message channel open for async response
  }

  if (message.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
    return true;
  }
});
