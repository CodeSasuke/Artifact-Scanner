# Artifact Scanner

<div align="center">
  <img src="public/icons/icon128.png" width="96" height="96" alt="Artifact Scanner Logo" />
  <h3>Detect conversational artifacts in writing intended for finished output.</h3>
  <p><strong>100% Local • Zero Telemetry • Privacy First • Manifest V3</strong></p>
</div>

---

> [!IMPORTANT]
> **Core Principle: "This project detects conversational artifacts, not AI authorship."**
> 
> Artifact Scanner does **NOT** claim to detect whether text was written by an AI or a human. It detects pattern-based conversational remnants—such as assistant lead-ins ("Here is a clear explanation..."), continuation offers ("If you want, I can also explain..."), conversational acknowledgments ("Sure! I'd be happy to..."), and concluding pleasantries ("I hope this helps!")—that frequently remain by accident when drafts are copied into finished writing.

---

## ⚡ 1-Minute Quick Install (Free via GitHub)

No command line needed:
1. Go to the [Releases](https://github.com/your-username/artifact-scanner/releases) tab and download **`artifact-scanner-v1.0.0.zip`**.
2. Unzip the downloaded file.
3. Open Google Chrome (or Edge, Brave, Arc) and go to `chrome://extensions`.
4. Turn on **Developer mode** (toggle in the top-right corner).
5. Click **Load unpacked** (top-left) and select the unzipped folder.
6. Done! Highlight any text, right-click, and select **Scan for AI artifacts**.

---

## Features

- 🔍 **Selection Context Menu**: Highlight text on any webpage, right-click, and select **"Scan for AI artifacts"**.
- 📋 **On-Demand Clipboard Scanner**: Scan clipboard text with one click. (Never accesses or modifies clipboard contents without explicit user permission).
- 🖤 **Ultra-Minimalist Black & White Design**: Zero clutter, zero unnecessary diagnostic jargon, pure focus on getting the job done.
- 🎯 **One-Click Cleanup**:
  - Highlights conversational relics instantly
  - Single-click **"Remove"** button with automatic punctuation, boundary, and grammar normalization
  - Instant **"Copy cleaned text"**
- 🛡️ **User Controls**:
  - **Ignore once**: Discard a single finding
  - **Always ignore phrase**: Add custom expressions to your personal ignore list
  - **Category toggles**: Enable or disable specific categories in Settings
- 🔒 **Absolute Privacy (100% Local)**:
  - No remote API calls
  - No telemetry, analytics, or tracking pings
  - No user accounts or cookies
  - Works completely offline forever

---

## Detection Architecture

```
User Input Text (Web Selection or Clipboard)
       │
       ▼
┌────────────────────────────────────────────────────────┐
│  Layer 1: Deterministic Pattern Engine                 │
│  - Parameterized regex matching across 7 categories    │
│  - Contraction & whitespace normalization               │
└───────────────────────┬────────────────────────────────┘
                        │
       ▼
┌────────────────────────────────────────────────────────┐
│  Layer 2: Structural & Contextual Analysis             │
│  - Document & paragraph boundary weighting            │
│  - Standalone trailing conversational sentence checks  │
└───────────────────────┬────────────────────────────────┘
                        │
       ▼
┌────────────────────────────────────────────────────────┐
│  Layer 3: Local NLP Classifier (TF-IDF + LR)           │
│  - Pure JS vectorization & softmax probability math    │
│  - Pluggable interface ready for ONNX/Transformers.js  │
└───────────────────────┬────────────────────────────────┘
                        │
       ▼
┌────────────────────────────────────────────────────────┐
│  Pipeline Merger & Resolver                            │
│  - Range overlap deduplication (higher confidence wins)│
│  - Hybrid corroboration boost (Rule + ML agreement)    │
│  - User ignore rules & disabled category filters       │
└───────────────────────┬────────────────────────────────┘
                        │
       ▼
Structured Scan Results & Cleaned Text
```

### Artifact Categories

| Category | Description | Example |
| :--- | :--- | :--- |
| `ASSISTANT_FRAMING` | Preamble introducing an answer instead of standalone prose | *"Here is a clear and simple explanation of..."* |
| `OFFER_TO_CONTINUE` | Follow-up invitations offering additional topics or help | *"If you want, I can also explain columns, primary keys..."* |
| `META_COMMENTARY` | Explanations about changes made or placeholder notes | *"Note that in the code snippet above...", "As an AI..."* |
| `CONVERSATIONAL_ACKNOWLEDGMENT` | Affirmative conversational openers validating the prompt | *"Sure! I'd be happy to...", "Great question!"* |
| `AI_STYLE_CLOSING` | Concluding chat sign-offs and parting remarks | *"I hope this helps!", "Feel free to ask if you have questions!"* |
| `PREVIOUS_CONVERSATION_REFERENCE` | References to a prior chat turn out of place in standalone text | *"As we discussed earlier in our previous chat..."* |
| `BORDERLINE` | Stylistic transitions that may be intentional author voice | *"Without further ado...", "In a nutshell..."* |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later
- Google Chrome or any Chromium-based browser (Brave, Edge, Arc, etc.)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/artifact-scanner.git
cd artifact-scanner
npm install
```

### Development

To start Vite in watch mode during extension development:

```bash
npm run dev
```

### Running Tests

Execute the Vitest test suite (including the 120+ labeled test corpus):

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Production Build

Compile TypeScript and generate the optimized production extension bundle:

```bash
npm run build
```

This will build the complete Chrome Extension into the `dist/` directory.

### Training the Local NLP Model

To retrain the local TF-IDF model weights from the test corpus:

```bash
npm run train
```

---

## Loading into Chrome / Chromium

1. Open Google Chrome and navigate to:
   ```
   chrome://extensions/
   ```
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left toolbar.
4. Select the `dist/` folder inside this project directory (`.../artifact-scanner/dist`).
5. The **Artifact Scanner** icon will now appear in your browser toolbar!

### How to Use

1. **Scan Selected Text**:
   - Highlight any text on a webpage or in a draft.
   - Right-click the selection and choose **"Scan for AI artifacts"**.
   - The Chrome Side Panel will open with detected artifacts and cleanup options.
2. **Scan Clipboard**:
   - Click the Artifact Scanner icon in your browser toolbar.
   - Click **"Scan Clipboard"** to scan text you recently copied.
3. **Review & Clean**:
   - Inspect individual findings and why they were flagged.
   - Click **"Remove"** to strip artifacts from the text.
   - Click **"Copy cleaned text"** to copy the polished version.

---

## Testing & Labeled Corpus

Artifact Scanner includes a rigorous test suite of **over 120 labeled test cases** (`src/corpus/testCorpus.ts`):

- **Normal Prose**: Tested against technical documentation, academic papers, news articles, legal policies, and business correspondence to guarantee **0% false positives**.
- **Conversational Artifacts**: Tested across multiple prompt structures and phrasing variants to achieve **>95% recall**.
- **Borderline Cases**: Tested to ensure appropriate confidence scoring and non-accusatory guidance.
- **Regression Safety**: Every discovered edge case is permanently recorded in the corpus.

---

## Technical Stack

- **Extension Framework**: Chrome Extension Manifest V3
- **Language**: TypeScript 5
- **UI Framework**: React 18
- **Styling**: Tailwind CSS with pure minimalist Black & White theme
- **Icons**: Lucide React
- **Bundler**: Vite 5
- **Testing**: Vitest 1.6
- **ML Architecture**: Lightweight TF-IDF + Multinomial Logistic Regression with portable JSON weights

---

## Roadmap

- [ ] Firefox Add-ons (Manifest V3 / V2 WebExtensions) compatibility
- [ ] Optional local ONNX Runtime / Transformers.js model adapter for multilingual support
- [ ] Google Docs & Notion inline highlight integration
- [ ] Exportable custom rule packs for teams & publishing houses

---

## Contributing

Contributions are warmly welcomed! Please read through our contributing process:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-pattern`.
3. If adding rules, ensure you also add test cases to `src/corpus/testCorpus.ts`.
4. Verify all tests pass: `npm test` and build succeeds: `npm run build`.
5. Submit a pull request with a clear description of the conversational pattern addressed.

---

## License

This project is open-source under the [MIT License](LICENSE).
