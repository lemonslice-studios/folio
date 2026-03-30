# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Is This

**Folio** is a local-first, offline-capable PWA for creating and presenting Markdown-based slides using Marp Core. It runs entirely in the browser with no network calls at runtime — all dependencies are bundled.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/
npm run watch      # build in watch mode (dev config)
npm test           # run tests with Vitest
```

There is no separate lint command — format with Prettier (`npx prettier --write .`).

## Architecture

### Tech Stack

| Concern | Library |
|---|---|
| Framework | Angular 21+ (standalone + Signals, no NgRx, no NgModules) |
| Slides engine | `@marp-team/marp-core` — Markdown → HTML |
| Editor | CodeMirror 6 (`@codemirror/*`) with custom Marp syntax theme |
| Filesystem | `lightning-fs` — IndexedDB-backed POSIX-like fs |
| Preferences | Raw `indexedDB` — single JSON value |
| UI | Angular Material 3 (M3 Expressive) + Angular CDK |
| Styles | SCSS + CSS custom properties (M3 tokens) |
| PWA | `@angular/pwa` (Workbox service worker) |
| Tests | Vitest + jsdom |

**Explicitly not used:** Tailwind, Dexie, RxJS state managers, NgRx, NgModules, second UI framework.

### App State (Signal-based, no NgRx)

A single root store service holds:

```typescript
presentationList: Signal<string[]>
currentFile: Signal<string | null>
currentMarkdown: Signal<string>
currentSlideIndex: Signal<number>
slideCount: Signal<number>
isDirty: Signal<boolean>
prefs: Signal<AppPrefs>  // { lastOpenFile, preferredTheme, editorFontSize, darkMode }
```

Use `effect()` for side effects (e.g., persist markdown to filesystem on change).

### Planned Build Order (MVP milestones)

1. **M1** — Shell layout (split-pane on wide, tabbed on narrow)
2. **M2** — Marp rendering (Markdown → sandboxed iframe)
3. **M3** — CodeMirror editor with Marp syntax highlighting
4. **M4** — Storage (lightning-fs persistence + IndexedDB prefs)
5. **M5** — Presentation mode (fullscreen, theme switcher)
6. **M6** — PWA (offline install, service worker)
7. **M7** — Export (HTML download, print-to-PDF)
8. **M8** — Polish (dark mode, micro-interactions)

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
