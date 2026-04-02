import { Injectable, signal } from '@angular/core';

export type ColorScheme = 'system' | 'light' | 'dark';

const COLOR_SCHEME_CYCLE: ColorScheme[] = ['system', 'light', 'dark'];

const SAMPLE_MARKDOWN = `---
marp: true
---

# Hello, Folio

A local-first Markdown slide editor.

---

## Writing slides is simple

Separate each slide with \`---\` and write Markdown.

- **Bold** and *italic* text
- \`Inline code\`
- Images, links, and more

---

## Themes

Folio supports three built-in Marp themes:
\`default\`, \`gaia\`, and \`uncover\`.

---

## Present

Hit the **▶ Present** button to go full-screen.
`;

@Injectable({ providedIn: 'root' })
export class AppStore {
  readonly currentMarkdown = signal(SAMPLE_MARKDOWN);
  readonly currentSlideIndex = signal(0);
  readonly slideCount = signal(1);
  readonly isDirty = signal(false);
  readonly colorScheme = signal<ColorScheme>('system');
  readonly editorWidth = signal(500);

  setMarkdown(value: string): void {
    this.currentMarkdown.set(value);
    this.isDirty.set(true);
  }

  setEditorWidth(width: number): void {
    const minWidth = 200;
    const maxWidth = window.innerWidth - 200;
    this.editorWidth.set(Math.max(minWidth, Math.min(width, maxWidth)));
  }

  setSlideCount(count: number): void {
    this.slideCount.set(count);
  }

  cycleColorScheme(): void {
    const current = this.colorScheme();
    const next = COLOR_SCHEME_CYCLE[(COLOR_SCHEME_CYCLE.indexOf(current) + 1) % COLOR_SCHEME_CYCLE.length];
    this.colorScheme.set(next);
  }

  goToSlide(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.slideCount() - 1));
    this.currentSlideIndex.set(clamped);
  }
}
