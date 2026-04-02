# Folio

A local-first, offline-capable PWA for creating and presenting Markdown slides using [Marp Core](https://github.com/marp-team/marp-core). Write Markdown, see slides rendered in real time, present full-screen — no server, no account, no data leaving the device.

Built with Angular 21, Angular Material 3 (M3 Expressive), and a Signal-based architecture.

---

## Getting started

```bash
npm install
npm start        # dev server → http://localhost:4200
```

## Commands

| Command | Description |
|---|---|
| `npm start` | Dev server at `http://localhost:4200` (HMR enabled) |
| `npm run build` | Production build → `dist/` |
| `npm run watch` | Build in watch mode (development config) |
| `npm test` | Run unit tests with Vitest |
| `npx prettier --write .` | Format all files |

## What works today

- **Split-pane layout** — editor left, preview right on wide screens (≥ 840 px); Edit / Preview tabs on narrow
- **Live Marp preview** — typing in the editor re-renders the iframe within 300 ms; first load is immediate
- **One slide at a time** — prev / next nav bar below the preview; keyboard navigation (`←` `→` `Space` `Backspace`) works in fullscreen
- **Present button** — Volt FAB bottom-right of the preview; triggers `requestFullscreen()` on the iframe
- **CodeMirror 6 editor** — JetBrains Mono, line-wrapping, undo/redo, full keyboard support
- **Marp syntax theme** — headings bold, bold/italic markers in Neon Coral, inline code in teal, comments muted, front-matter keys in Plasma; `---` slide separators render as a full-width Volt-on-dark bar
- **Cheat bar** — six snippet categories (Insert / Slide / Theme / Image / Text / Note), each opens a Material menu; items insert at the cursor and show a monospace hint for learning the syntax

## Stack

| Concern | Library | State |
|---|---|---|
| Framework | Angular 21 — standalone components, Signals | ✅ wired |
| Slides engine | `@marp-team/marp-core` | ✅ wired |
| Editor | CodeMirror 6 (`@codemirror/*`) | ✅ wired |
| UI | Angular Material 3 (M3 Expressive) + Angular CDK | ✅ wired |
| Styles | SCSS + CSS custom properties (M3 tokens) | ✅ wired |
| Filesystem | `lightning-fs` — IndexedDB-backed POSIX fs | M4 |
| Preferences | Raw IndexedDB — single JSON value | M5 |
| PWA | `@angular/pwa` (Workbox service worker) | M6 |
| Tests | Vitest + jsdom | — |

## Milestones

| # | Milestone | Status |
|---|---|---|
| M1 | Shell layout — split-pane (wide) / tabbed (narrow), toolbar | ✅ Done |
| M2 | Marp rendering — live Markdown → iframe preview, slide nav, fullscreen keyboard nav | ✅ Done |
| M3 | CodeMirror editor — syntax theme, `---` bar decoration, cheat bar | ✅ Done |
| M4 | Storage — lightning-fs persistence, file list, create / rename / delete | Planned |
| M5 | Presentation mode — fullscreen, slide nav, theme switcher | Planned |
| M6 | PWA — offline install, service worker, bundled fonts | Planned |
| M7 | Export — download `.md`, self-contained HTML, print-to-PDF | Planned |
| M8 | Polish — dark mode, micro-interactions, M3 Expressive theming complete | Planned |

## Design principles

Folio follows **Quiet Tech** constraints — every feature must satisfy:

- **No data, just art** — zero network calls at runtime after install; no analytics or telemetry
- **Digital respect** — no background processes, no battery-draining workers
- **Minimum permissions** — no camera, mic, contacts, or location access
