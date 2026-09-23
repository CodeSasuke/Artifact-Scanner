# Artifact Scanner

An open-source Chrome extension that catches and removes conversational AI remnants from writing before you hit publish.

No tracking. No accounts. 100% offline.

---

### What it does

When copying text out of an AI chat into an email, document, or article, conversational tells often slip through:

- *"Sure, let's take a closer look at this concept."*
- *"If you want, I can also walk you through..."*
- *"I hope this helps! Feel free to ask if you have questions."*

Artifact Scanner highlights these phrases in a clean side panel and lets you remove them in one click. Sentence boundaries, punctuation, and capitalization are automatically restored.

> **Note:** This is not an "AI detector." It does not claim to identify whether text was written by an AI or human. It strictly targets conversational speech acts that don't belong in finished prose.

---

### Quick Install

1. Download **[`artifact-scanner-v1.0.0.zip`](https://github.com/CodeSasuke/Artifact-Scanner/releases)** and unzip it.
2. Open Chrome (or Edge, Brave, Arc) and go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right toggle).
4. Click **Load unpacked** (top-left) and select the unzipped folder.

Highlight any text on any webpage, right-click, and select **"Scan for AI artifacts"**.

---

### Privacy

Everything runs client-side in your browser.
- No API keys required
- No remote servers or network requests
- Zero telemetry, analytics, or tracking
- On-demand clipboard scanning (never reads without clicking "Scan Clipboard")

---

### Development

```bash
git clone https://github.com/CodeSasuke/Artifact-Scanner.git
cd Artifact-Scanner
npm install

npm test         # run unit tests and 120+ corpus validation
npm run build    # compile production extension to dist/
npm run package  # build and zip release package
```

---

### License

[MIT](LICENSE)
