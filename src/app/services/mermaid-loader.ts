/**
 * Module-level cache for bundled script contents (mermaid, Paged.js).
 * Fetched once and shared across MarpService and ProseService.
 *
 * The scripts are inlined into the preview srcdoc rather than referenced via
 * `<script src>`: the preview iframe is sandboxed (opaque origin), so it does
 * not go through the app's service worker and a src reference would fail
 * offline. The content is escaped so it can sit inside an inline script tag.
 */
const cache = new Map<string, Promise<string>>();

function loadScriptContent(path: string): Promise<string> {
  let cached = cache.get(path);
  if (!cached) {
    cached = fetch(path)
      .then(r => (r.ok ? r.text() : ''))
      .then(s => s.replace(/<\/script/gi, '<\\/script'))
      .catch(() => '');
    cache.set(path, cached);
  }
  return cached;
}

export function loadMermaidScript(): Promise<string> {
  return loadScriptContent('js/mermaid.min.js');
}

export function loadPagedScript(): Promise<string> {
  return loadScriptContent('js/paged.polyfill.min.js');
}
