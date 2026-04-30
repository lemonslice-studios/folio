# Utility Dock UI Refactor Spec

## Objective
Replace the two bottom strip bars with a shared Material 3 styled floating Utility Dock pattern that preserves current utility while visually aligning with the app's M3 design language.

## Problem Statement
Current bottom UI in both panes uses full-width bars with hard top borders and dense controls. They feel visually disconnected from the rest of the interface, which already uses floating actions and container surfaces.

## Goals
1. Keep all existing functionality and shortcuts.
2. Remove full-width bottom strip look from editor and preview panes.
3. Use one coherent dock pattern across panes.
4. Maintain accessibility and keyboard operability.
5. Keep behavior parity with current implementation.
6. Make sure that the new functionality works on small mobile form factors too

## Non-Goals
1. Do not change markdown insertion logic.
2. Do not change slide rendering logic.
3. Do not redesign dialogs or app-wide layout.
4. Do not introduce new feature scope beyond visual and structural dock refactor.

## Target Files
1. [src/app/editor-pane/cheat-bar/cheat-bar.html](src/app/editor-pane/cheat-bar/cheat-bar.html)
2. [src/app/editor-pane/cheat-bar/cheat-bar.scss](src/app/editor-pane/cheat-bar/cheat-bar.scss)
3. [src/app/editor-pane/editor-pane.scss](src/app/editor-pane/editor-pane.scss)
4. [src/app/preview-pane/preview-pane.html](src/app/preview-pane/preview-pane.html)
5. [src/app/preview-pane/preview-pane.scss](src/app/preview-pane/preview-pane.scss)
6. Optional shared tokens: [src/styles.scss](src/styles.scss)

## UX Pattern

### Shared Dock Pattern
Use a floating rounded container anchored above pane bottom edge.

Visual characteristics:
1. Surface: surface-container-high (or closest existing token in project).
2. Shape: large rounded corners (20px to 24px).
3. Elevation: soft shadow to imply lift.
4. Edge treatment: no top border line.
5. Spacing: consistent horizontal and vertical padding.
6. Safe area support: include env safe-area-inset-bottom where relevant.

Behavior:
1. Dock should not consume full pane width on desktop.
2. Dock should expand toward near-full width with side insets on narrow screens.
3. Dock content should support horizontal overflow gracefully for editor categories.

### Editor Pane Dock
Convert cheat-bar from strip to Utility Dock containing category chips.

Control model:
1. Category trigger controls should look like M3 chips or tonal segmented pills.
2. Keep existing menu behavior per category.
3. Keep current category filtering by document type.
4. Preserve mousedown preventDefault behavior for editor focus preservation.

Layout:
1. Dock anchored bottom-center in editor pane.
2. Existing AI FAB should remain, repositioned to avoid dock overlap.
3. Maintain z-index layering so dock and FAB render correctly above editor surface.

### Preview Pane Dock
Replace slide-nav and prose-info strip styles with the same dock language.

Slides mode content:
1. Previous button.
2. Slide counter (tabular numerals).
3. Next button.
4. Present action remains prominent, but visually coordinated with dock.

Prose mode content:
1. Current mode label and page count where applicable.
2. Toggle prose mode action integrated visually with dock system.

Layout:
1. Dock anchored bottom-center.
2. Back to editor mini FAB remains available and non-overlapping.
3. Present and prose toggle actions should align with dock spacing and vertical rhythm.

## Motion and Interaction
1. Add subtle entrance transition for dock (opacity plus translateY).
2. Keep interaction feedback fast and minimal (100ms to 160ms range).
3. Avoid flashy animations; prefer understated motion.

## Accessibility Requirements
1. Preserve current aria-labels and aria-live behavior.
2. Ensure minimum 44px effective touch target on mobile.
3. Keep clear focus-visible treatment with high contrast.
4. Ensure contrast ratio remains WCAG AA compliant.
5. Do not remove keyboard navigation paths for menus or nav controls.

## Implementation Guidance

### Styling Tokens
If needed, define local variables for consistency:
1. --dock-bg
2. --dock-radius
3. --dock-shadow
4. --dock-gap
5. --dock-padding

Use existing design tokens first; only add new CSS vars when necessary.

### Structural Guidance
1. Keep semantic roles intact for toolbar and nav.
2. Prefer minimal template changes when possible.
3. Consolidate repeated dock style rules into reusable selectors or shared partial patterns in current SCSS architecture.

### Responsive Guidance
1. Desktop: intrinsic dock width based on content, max-width cap.
2. Tablet/mobile: dock width calc with side margins.
3. Ensure dock never clips critical controls.

## Acceptance Criteria
1. No full-width bottom strip remains in editor pane or preview pane.
2. Both panes present visually consistent floating Utility Dock pattern.
3. All existing actions still work exactly as before.
4. Editor focus retention behavior remains intact when using cheat controls.
5. Slides and prose states remain functionally unchanged.
6. No new accessibility regressions introduced.
7. AI FAB, present FAB, prose toggle FAB, and back FAB remain reachable and non-overlapping.
8. App builds and tests pass.

## Validation Checklist
1. Run app and verify editor dock in prose and slides document types.
2. Verify all cheat categories open menus and insert snippets as before.
3. Verify preview dock in slides mode: prev and next and counter and present.
4. Verify preview dock in prose mode: view label and toggle behavior.
5. Verify keyboard navigation and focus states.
6. Verify mobile width behavior and safe-area insets.
7. Run test suite and build.

## Suggested Agent Execution Plan
1. Create shared dock style primitives in pane-level SCSS files.
2. Refactor cheat-bar styles first while preserving template logic.
3. Refactor preview navigation and prose info visual shell.
4. Reconcile FAB positioning to avoid collisions.
5. Validate across document types and breakpoints.
6. Run tests and build and capture before-and-after screenshots if available.

## Deliverables
1. Updated editor and preview templates and styles implementing Utility Dock pattern.
2. No behavior regressions in existing controls.
3. Brief implementation notes summarizing any token additions or spacing decisions.
