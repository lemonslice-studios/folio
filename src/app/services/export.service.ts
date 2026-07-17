import { Injectable, inject } from '@angular/core';
import { MarpService } from './marp.service';
import { ProseService } from './prose.service';
import { AppStore } from '../store/app-store';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly marpService = inject(MarpService);
  private readonly proseService = inject(ProseService);
  private readonly store = inject(AppStore);

  downloadMarkdown(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/markdown' });
    this.download(filename, blob);
  }

  async downloadHtml(filename: string, markdown: string): Promise<void> {
    const type = this.store.documentType();
    let fullHtml = '';
    const title = filename.replace(/\.slides\.md$/, '').replace(/\.md$/, '');

    if (type === 'slides') {
      const { html, css } = this.marpService.render(markdown);
      fullHtml = this.marpService.buildSrcdoc(html, css, false, this.store.appTheme(), true, title);
    } else {
      const { html } = this.proseService.render(markdown);
      fullHtml = this.proseService.buildSrcdoc(html, false, 'paged', 'system', this.store.appTheme(), this.store.prefs().fontFamily, true, title);
    }

    // SVG Embedding for Standalone Exports
    if (fullHtml.includes('class="mermaid"')) {
      fullHtml = await this.renderMermaidToSvg(fullHtml);
    }

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const htmlFilename = filename.replace(/\.slides\.md$/, '').replace(/\.md$/, '') + '.html';
    this.download(htmlFilename, blob);
  }

  private renderMermaidToSvg(srcdoc: string): Promise<string> {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      // Opaque origin: exported markdown may contain arbitrary HTML which must
      // not run with access to the app's IndexedDB (files, API keys, tokens).
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '1200px';
      iframe.style.height = '800px';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const cleanup = () => {
        window.removeEventListener('message', onMessage);
        document.body.removeChild(iframe);
      };

      const onMessage = (e: MessageEvent) => {
        if (e.source !== iframe.contentWindow || e.data?.folioIdentifier !== 'folio-export') return;

        if (e.data.type === 'mermaidReady') {
          iframe.contentWindow?.postMessage({ type: 'folio-get-rendered-html' }, '*');
        } else if (e.data.type === 'rendered-html') {
          cleanup();
          resolve(e.data.html);
        }
      };

      window.addEventListener('message', onMessage);
      iframe.srcdoc = srcdoc;

      // Fallback: if mermaid fails to signal or isn't actually there
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          iframe.contentWindow?.postMessage({ type: 'folio-get-rendered-html' }, '*');
        }
      }, 5000);
    });
  }

  print(markdown: string): void {
    const type = this.store.documentType();
    let fullHtml = '';
    const filename = this.store.currentFile() || 'Folio';
    const title = filename.replace(/\.slides\.md$/, '').replace(/\.md$/, '');

    if (type === 'slides') {
      const { html, css } = this.marpService.render(markdown);
      fullHtml = this.marpService.buildSrcdoc(html, css, true, this.store.appTheme(), false, title);
    } else {
      const { html } = this.proseService.render(markdown);
      fullHtml = this.proseService.buildSrcdoc(html, true, this.store.proseViewMode(), 'system', this.store.appTheme(), this.store.prefs().fontFamily, false, title);
    }
    
    const printFrame = document.createElement('iframe');
    // Sandboxed like the preview; allow-modals is needed for window.print(),
    // which the frame invokes itself on receiving the 'folio-print' message
    // (the parent cannot call print() across the sandbox boundary).
    printFrame.setAttribute('sandbox', 'allow-scripts allow-modals');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const cleanup = () => {
      if (!document.body.contains(printFrame)) return;
      document.body.removeChild(printFrame);
      window.removeEventListener('message', onPrintMessage);
    };

    let hasPrinted = false;
    const doPrint = () => {
      if (hasPrinted) return;
      hasPrinted = true;
      printFrame.contentWindow?.postMessage({ type: 'folio-print' }, '*');
      // Fallback: remove the frame eventually even if 'printDone' never arrives
      // (the frame must stay alive while the print dialog is open).
      setTimeout(cleanup, 120000);
    };

    const onPrintMessage = (e: MessageEvent) => {
      if (e.source !== printFrame.contentWindow) return;
      if (e.data?.type === 'printReady') {
        doPrint();
      } else if (e.data?.type === 'printDone') {
        setTimeout(cleanup, 100);
      }
    };

    window.addEventListener('message', onPrintMessage);

    printFrame.srcdoc = fullHtml;
    
    // Fallback: if mermaid isn't present or signals are never sent, print after a delay
    printFrame.onload = () => setTimeout(doPrint, 1500);
  }

  private download(filename: string, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
