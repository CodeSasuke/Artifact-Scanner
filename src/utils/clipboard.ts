/**
 * Explicit clipboard utilities.
 * Only triggered on direct user interaction (button click).
 * Never automatically reads or overwrites clipboard data without explicit user initiation.
 */

export async function readClipboardText(): Promise<string> {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    throw new Error('Clipboard access is not supported in this browser context.');
  }
  return await navigator.clipboard.readText();
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    // Fallback using textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (e) {
      textArea.remove();
      return false;
    }
  }

  await navigator.clipboard.writeText(text);
  return true;
}
