/**
 * Content Script for Artifact Scanner
 * Runs in document_idle to handle text selections and optional in-page actions.
 */

// Listen for messages from background script or sidepanel
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    const selectedText = window.getSelection()?.toString() || '';
    sendResponse({ text: selectedText });
    return true;
  }

  if (message.type === 'REPLACE_SELECTION') {
    const newText = message.text;
    const activeEl = document.activeElement as HTMLInputElement | HTMLTextAreaElement;

    if (activeEl && typeof activeEl.selectionStart === 'number' && typeof activeEl.selectionEnd === 'number') {
      const start = activeEl.selectionStart;
      const end = activeEl.selectionEnd;
      activeEl.setRangeText(newText, start, end, 'end');
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, reason: 'No active editable input element' });
    }
    return true;
  }
});
