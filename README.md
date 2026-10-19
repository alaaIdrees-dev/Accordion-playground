# Accordion Playground

An interactive React + Vite playground for a configurable FAQ accordion: live preview on the left, a props control panel on the right, and a generated-JSX panel underneath that always matches the current configuration.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  main.jsx                      React entry point
  App.jsx / App.css             Top-level layout: header, workspace grid, search
  data/
    faqData.js                  The 5 sample FAQ items (4 real + 1 disabled demo)
  hooks/
    useAccordionState.js        Open/close state + the defaultOpen-change effect
  utils/
    accordionLogic.js           Pure open/close transition rules (framework-free)
    generateCode.js             Single source of truth for the generated JSX
                                 (both the plain copy text and the highlighted
                                 tokens are derived from the same segment list)
  components/
    Accordion/
      Accordion.jsx / .css      Renders items, the loading skeleton, or the
                                 empty-search state; owns the three variants
      AccordionItem.jsx         One trigger/panel pair, including a11y wiring
      index.js                  Barrel export (matches the generated import path)
    PropsPanel/
      PropsPanel.jsx / .css     All 8 controls + Reset to Defaults
      FormControls.jsx          Reusable Select / Segmented / Toggle controls
    CodePreview/
      CodePreview.jsx / .css    Dark editor-style panel, syntax highlighting,
                                 copy-to-clipboard with graceful fallback
scripts/
  verify-logic.mjs              Dependency-free test script for the core logic
                                 (see "What was verified" below) — run with
                                 `node scripts/verify-logic.mjs`
```

## Implemented features

- **Variants**: bordered (shared outline), separated (individual cards), minimal (flat with divider lines).
- **Icons**: chevron / plus / arrow, each with a distinct open-state rotation; placed at the start or end of the trigger.
- **Single vs. multiple expansion**, with **collapsible** governing whether an already-open item can be closed again by clicking it — in both modes.
- **Disabled demo item**: a real, data-driven item whose `disabled` state is wired to a control, using a native `disabled` button (so it's unreachable by mouse *or* keyboard, not just visually dimmed).
- **Loading state**: swaps the list for five shimmering skeleton rows; the search input disables itself while loading.
- **Search**: filters by question and answer text without touching open/closed state; shows a dedicated empty-state message when nothing matches.
- **Default open item**: changing it re-opens that item without resetting anything else you've toggled by hand.
- **Reset to Defaults**: restores the initial config and clears the search field.
- **Generated JSX panel**: reflects every control above, immediately, with syntax highlighting and a dark editor theme. The "Copy code" button uses the Clipboard API and falls back to a hidden-textarea + `execCommand('copy')` technique when that API is unavailable, with a status message either way.
- **Accessibility**: native `<button>` triggers with `aria-expanded`/`aria-controls`, panels with `role="region"` and `aria-labelledby`, visible focus rings throughout, labelled form controls, and `prefers-reduced-motion` support (all transitions and the skeleton shimmer are disabled).
- **Responsive layout**: two-column workspace (preview + props) down to ~960px, then a single stacked column; the code panel always spans full width.

## What was verified, and what wasn't

This was built in a sandboxed environment with **no network access**, so `npm install` could not actually be run here, and the dev server / production build were not executed end-to-end against the real `vite` and `lucide-react` packages. To avoid claiming more than was actually checked:

- **Every `.js`/`.jsx` file was parsed with `esbuild`** (JSX transform, ES modules) and confirmed syntactically valid, individually and as one bundled module graph (all relative imports resolve correctly — `react`/`react-dom` from a local global install, and a temporary same-API stub standing in for `lucide-react`, since that package couldn't be downloaded here).
- **The framework-free core logic was unit-tested directly in Node** (24 assertions, all passing) — see `scripts/verify-logic.mjs`. It covers: every open/close combination of `multiple` × `collapsible`, the disabled-item rule, that generated code changes with every config option (and only the options that should appear do), that the highlighted segments and the plain copy text never diverge, and attribute-value escaping.
- **Not verified here**: the actual `npm install` resolving real package versions, the Vite dev server rendering in a browser, the production build output, real `lucide-react` icon rendering, and real clipboard behavior (which only works in a secure browser context, not in Node).

Please run `npm install && npm run dev` and click through the controls once — if anything looks off, it'll be in the untested 10%, not the logic layer.
