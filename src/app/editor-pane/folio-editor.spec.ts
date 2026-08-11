import { describe, it, expect } from 'vitest';
import { isValidUrl, isImageUrl, SNIPPETS, marpCompletionSource } from './folio-editor';
import { EditorState } from '@codemirror/state';
import { CompletionContext } from '@codemirror/autocomplete';

describe('folio-editor helpers', () => {
  describe('isValidUrl', () => {
    it('should validate typical web URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=1')).toBe(true);
      expect(isValidUrl('file:///home/user/pic.png')).toBe(true);
    });

    it('should reject non-URL text', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('hello world')).toBe(false);
    });
  });

  describe('isImageUrl', () => {
    it('should detect known image formats from extensions', () => {
      expect(isImageUrl('https://example.com/image.png')).toBe(true);
      expect(isImageUrl('https://example.com/image.JPEG')).toBe(true);
      expect(isImageUrl('https://example.com/image.gif?sz=200')).toBe(true);
      expect(isImageUrl('http://example.com/image.webp#main')).toBe(true);
    });

    it('should detect data URL images', () => {
      expect(isImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA')).toBe(true);
    });

    it('should return false for non-image URLs', () => {
      expect(isImageUrl('https://example.com/index.html')).toBe(false);
      expect(isImageUrl('https://example.com/path/')).toBe(false);
    });
  });

  describe('SNIPPETS & autocomplete', () => {
    it('defines snippet templates with placeholders for closed syntax markers', () => {
      const bold = SNIPPETS.find((s) => s.label === '**Bold**');
      expect(bold?.template).toBe('**${text}**');

      const italic = SNIPPETS.find((s) => s.label === '*Italic*');
      expect(italic?.template).toBe('*${text}*');

      const highlight = SNIPPETS.find((s) => s.label === '== Highlight ==');
      expect(highlight?.template).toBe('==${text}==');

      const code = SNIPPETS.find((s) => s.label === '`Inline code`');
      expect(code?.template).toBe('`${code}`');

      const mathInline = SNIPPETS.find((s) => s.label === '$ Math Inline');
      expect(mathInline?.template).toBe('$${formula}$');
    });

    it('returns snippet completions for syntax markers', () => {
      const state = EditorState.create({ doc: '**' });
      const context = new CompletionContext(state, 2, true);
      const res = marpCompletionSource(context);
      expect(res).not.toBeNull();
      expect(res?.options.length).toBeGreaterThan(0);
      const boldOpt = res?.options.find((o) => o.label === '**Bold**');
      expect(boldOpt).toBeDefined();
      expect(typeof boldOpt?.apply).toBe('function');
    });

    it('triggers image snippet on ! and ![ in prose mode', () => {
      const state1 = EditorState.create({ doc: '!' });
      const context1 = new CompletionContext(state1, 1, false);
      const res1 = marpCompletionSource(context1);
      expect(res1).not.toBeNull();
      const img1 = res1?.options.find((o) => o.label === '![alt] Image');
      expect(img1).toBeDefined();

      const state2 = EditorState.create({ doc: '![' });
      const context2 = new CompletionContext(state2, 2, false);
      const res2 = marpCompletionSource(context2);
      expect(res2).not.toBeNull();
      const img2 = res2?.options.find((o) => o.label === '![alt] Image');
      expect(img2).toBeDefined();
    });

    it('triggers image snippet on ! and ![ in slide mode', () => {
      const doc = '---\nmarp: true\n---\n!';
      const state = EditorState.create({ doc });
      const context = new CompletionContext(state, doc.length, false);
      const res = marpCompletionSource(context);
      expect(res).not.toBeNull();
      const img = res?.options.find((o) => o.label === '![bg] Background');
      expect(img).toBeDefined();
    });
  });
});
