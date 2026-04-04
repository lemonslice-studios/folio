import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  keymap,
} from '@codemirror/view';
import { Extension, RangeSetBuilder } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { tags } from '@lezer/highlight';
import { autocompletion, CompletionContext, CompletionResult } from '@codemirror/autocomplete';

// ── Themes list ──────────────────────────────────────────────────────────────

const MARPX_THEMES = [
  'cantor', 'church', 'copernicus', 'einstein', 
  'frankfurt', 'galileo', 'gauss', 'gropius', 
  'gödel', 'haskell', 'hobbes', 'lorca', 
  'marpx', 'newton', 'socrates', 'sparta'
];

const BUILTIN_THEMES = ['default', 'gaia', 'uncover'];

const ALL_THEMES = [...BUILTIN_THEMES, ...MARPX_THEMES].sort();

// ── Syntax highlight style ───────────────────────────────────────────────────

const marpHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.heading1, tags.heading2, tags.heading3,
          tags.heading4, tags.heading5, tags.heading6],
    color: 'var(--cm-color-heading)',
    fontWeight: 'bold',
  },
  { tag: tags.strong,   color: 'var(--cm-color-emphasis)', fontWeight: 'bold' },
  { tag: tags.emphasis, color: 'var(--cm-color-emphasis)', fontStyle: 'italic' },
  { tag: tags.monospace, color: 'var(--cm-color-code)' },
  { tag: [tags.comment, tags.blockComment, tags.lineComment],
    color: 'var(--cm-color-comment)', fontStyle: 'italic' },
  { tag: [tags.meta, tags.keyword, tags.propertyName],
    color: 'var(--cm-color-meta)' },
  { tag: tags.url, color: 'var(--cm-color-code)' },
]);

// ── Slide separator line decoration ─────────────────────────────────────────

const separatorDecoration = Decoration.line({
  attributes: { class: 'cm-marp-separator' },
});

function buildSeparatorDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      if (/^-{3,}\s*$/.test(line.text)) {
        builder.add(line.from, line.from, separatorDecoration);
      }
      pos = line.to + 1;
    }
  }
  return builder.finish();
}

const separatorPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildSeparatorDecorations(view);
    }
    update(update: ViewUpdate): void {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildSeparatorDecorations(update.view);
      }
    }
  },
  { decorations: v => v.decorations },
);

// ── Autocomplete ─────────────────────────────────────────────────────────────

function themeCompletionSource(context: CompletionContext): CompletionResult | null {
  const line = context.state.doc.lineAt(context.pos);
  const lineText = line.text.slice(0, context.pos - line.from);
  
  // Match 'theme: ' followed by optional partial theme name
  const match = lineText.match(/^theme:\s*(\w*)$/);
  if (!match) return null;

  return {
    from: line.from + lineText.lastIndexOf(match[1]),
    options: ALL_THEMES.map(theme => ({
      label: theme,
      type: 'keyword',
      detail: MARPX_THEMES.includes(theme) ? 'X' : '',
      boost: theme === 'default' ? 1 : 0
    })),
    filter: true
  };
}

// ── Base editor theme ────────────────────────────────────────────────────────

const marpBaseTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '1rem',
    background: 'var(--surface)',
    color: 'var(--on-surface)',
  },
  '.cm-scroller': {
    fontFamily: 'var(--font-editor)',
    lineHeight: '1.6',
    overflow: 'auto',
  },
  '.cm-content': {
    padding: '1.25rem',
    caretColor: 'var(--color-plasma)',
    minHeight: '100%',
  },
  '.cm-cursor, .cm-dropCursor': {
    borderLeftColor: 'var(--color-plasma)',
    borderLeftWidth: '2px',
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-activeLine': { backgroundColor: 'rgba(124, 77, 255, 0.04)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: 'rgba(124, 77, 255, 0.18)',
  },
  '.cm-gutters': { display: 'none' },
  '.cm-marp-separator': {
    background: 'var(--cm-separator-bg) !important',
    color: 'var(--cm-separator-color) !important',
    fontWeight: 'bold',
  },
  '.cm-placeholder': {
    color: 'var(--color-plasma)',
    opacity: '0.5',
    fontStyle: 'normal',
  },
  // Autocomplete styling to match M3 Expressive
  '.cm-tooltip-autocomplete': {
    border: '1px solid var(--outline)',
    backgroundColor: 'var(--surface) !important',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  '.cm-tooltip-autocomplete > ul': {
    fontFamily: 'var(--font-ui)',
    padding: '4px 0',
  },
  '.cm-tooltip-autocomplete > ul > li': {
    padding: '6px 12px !important',
    display: 'flex !important',
    justifyContent: 'flex-start !important',
    alignItems: 'center',
    textAlign: 'left !important',
  },
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    backgroundColor: 'var(--color-plasma) !important',
    color: 'white !important',
  },
  '.cm-completionLabel': {
    flex: 'none',
  },
  '.cm-completionDetail': {
    marginLeft: '12px',
    fontWeight: 'bold',
    color: 'var(--color-plasma)',
    fontSize: '0.75rem',
    flex: '1',
    textAlign: 'right',
  },
  'li[aria-selected] .cm-completionDetail': {
    color: 'white',
  }
});

// ── Public extension factory ─────────────────────────────────────────────────

export function createMarpExtensions(
  onChange: (content: string) => void,
  onCursorMove: (slideIndex: number) => void,
): Extension[] {
  return [
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    markdown(),
    marpBaseTheme,
    syntaxHighlighting(marpHighlightStyle),
    separatorPlugin,
    EditorView.lineWrapping,
    autocompletion({
      override: [themeCompletionSource]
    }),
    EditorView.updateListener.of(update => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
      
      if (update.selectionSet || update.docChanged) {
        const fullText = update.state.doc.toString();
        const pos = update.state.selection.main.head;
        const textBefore = fullText.slice(0, pos);
        
        const linesBefore = textBefore.split('\n');
        let separatorsBefore = 0;
        for (const line of linesBefore) {
          if (/^-{3,}\s*$/.test(line)) {
            separatorsBefore++;
          }
        }

        const hasFrontMatter = fullText.trimStart().startsWith('---');
        let slideIndex = 0;

        if (hasFrontMatter) {
          if (separatorsBefore <= 2) {
            slideIndex = 0;
          } else {
            slideIndex = separatorsBefore - 2;
          }
        } else {
          slideIndex = separatorsBefore;
        }
        
        onCursorMove(slideIndex);
      }
    }),
  ];
}
