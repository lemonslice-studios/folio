import { Injectable } from '@angular/core';
// @ts-ignore
import MarkdownIt from 'markdown-it';
import { configureMarkdownPlugins } from './configure-markdown';

@Injectable({ providedIn: 'root' })
export class ProseService {
  private readonly md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  });

  constructor() {
    configureMarkdownPlugins(this.md);
  }

  render(markdown: string): { html: string } {
    const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
    const html = this.md.render(body);
    return { html };
  }

  buildSrcdoc(html: string, isExport: boolean = false, proseMode: 'flow' | 'paged' = 'flow'): string {
    const isPaged = proseMode === 'paged';

    let pagedScript = '';
    if (isPaged && !isExport) {
      pagedScript = `<script src="js/mermaid.min.js"></script>
<script src="js/paged.polyfill.min.js"></script>
<script>
window.PagedConfig = {
  auto: false,
  after: function(flow) {
    window.parent.postMessage({ pageCount: flow.total }, '*');
    if (window.mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        flowchart: { useMaxWidth: false, htmlLabels: true }
      });
      mermaid.run({ querySelector: '.mermaid' });
    }
  }
};
window.addEventListener('DOMContentLoaded', function() {
  window.PagedPolyfill.preview();
});
</script>`;
    } else if (!isExport) {
      pagedScript = `<script src="js/mermaid.min.js"></script>
<script>
window.addEventListener('DOMContentLoaded', function() {
  if (window.mermaid) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      flowchart: { useMaxWidth: false, htmlLabels: true }
    });
    mermaid.run({ querySelector: '.mermaid' });
  }
});
</script>`;
    }

    const pagedStyles = isPaged ? `
  @page {
    size: A4 portrait;
    margin: 20mm 22mm;
  }

  hr {
    break-before: page;
    border: none;
    height: 0;
    margin: 0;
    visibility: hidden;
  }

  body {
    background: ${isExport ? 'white' : '#f0f0f0'};
  }

  .markdown-body {
    background: white;
  }

  .pagedjs_page {
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
    margin: 0 auto 24px;
  }

  ${isExport ? '.pagedjs_page { box-shadow: none; margin: 0; }' : ''}
` : `
  body {
    background: white;
    padding: 2rem;
  }

  hr {
    border: none;
    border-top: 1px solid var(--outline-variant, #eee);
    margin: 2rem 0;
  }
`;

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Folio Document</title>
<style>
  html, body {
    width: 100%;
    margin: 0;
    padding: 0;
    background: white;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #1d1b20;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .markdown-body {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    ${isExport ? `
      max-width: 840px;
      margin: 0 auto;
      padding: 4rem 2rem;
    ` : ''}
  }

  .markdown-body p, .markdown-body ul, .markdown-body ol,
  .markdown-body blockquote, .markdown-body pre, .markdown-body table {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .markdown-body h1 { font-size: 2rem; font-weight: 400; margin: 2rem 0 1rem; line-height: 1.2; }
  .markdown-body h2 { font-size: 1.5rem; font-weight: 400; margin: 1.5rem 0 1rem; line-height: 1.2; }
  .markdown-body h3 { font-size: 1.25rem; font-weight: 500; margin: 1.2rem 0 0.8rem; line-height: 1.2; }

  .markdown-body strong, .markdown-body b { font-weight: 600; }
  .markdown-body em, .markdown-body i { font-style: italic; }

  .markdown-body ul, .markdown-body ol { padding-left: 1.5rem; }
  .markdown-body li { margin-bottom: 0.5rem; }
  .markdown-body li > p { margin-bottom: 0.25rem; }

  h1, h2, h3, h4, h5, h6 {
    font-family: system-ui, -apple-system, sans-serif;
    margin-top: 1.4em;
    margin-bottom: 0.4em;
    line-height: 1.2;
  }
  p { margin: 0 0 0.9em; }

  pre, code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.88em;
  }
  pre {
    background: #f5f5f5;
    padding: 0.8em 1em;
    border-radius: 4px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  blockquote {
    border-left: 3px solid #aaa;
    margin-left: 0;
    padding-left: 1em;
    color: #555;
    font-style: italic;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
  }
  th, td {
    border: 1px solid #ccc;
    padding: 0.4em 0.7em;
    text-align: left;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .mermaid-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 1em 0;
  }

  ${isExport ? 'body { background: white; }' : ''}

  ${pagedStyles}
</style>
</head>
<body>
<div class="markdown-body">
${html}
</div>
${pagedScript}
</body>
</html>`;
  }
}
