import { ChangeDetectionStrategy, Component, inject, computed, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppStore, SAMPLE_MARKDOWN, SAMPLE_PROSE } from '../store/app-store';
import { SettingsDialogComponent } from '../settings-dialog/settings-dialog';
import { FsService } from '../services/fs.service';
import { EditorService } from '../services/editor.service';
import JSZip from 'jszip';

@Component({
  selector: 'app-file-list-drawer',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './file-list-drawer.html',
  styleUrl: './file-list-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListDrawerComponent {
  protected readonly store = inject(AppStore);
  protected readonly fs = inject(FsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly editorService = inject(EditorService);

  readonly closeDrawer = output<void>();

  async onNewSlides(): Promise<void> {
    const filename = await this.store.createFile(
      'Untitled Slides.slides.md',
      SAMPLE_MARKDOWN,
      true,
    );
    this.showNewFileSnackBar(filename, true);
    this.closeDrawer.emit();
  }

  async onNewProse(): Promise<void> {
    const filename = await this.store.createFile('Untitled Document.md', SAMPLE_PROSE, false);
    this.showNewFileSnackBar(filename, false);
    this.closeDrawer.emit();
  }

  async onImportFile(): Promise<void> {
    // Create a hidden file input to let the user pick a local file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.markdown,text/markdown,text/plain';
    input.multiple = false;

    // Wait for selection
    const file: File | null = await new Promise((resolve) => {
      input.onchange = () => resolve(input.files ? input.files[0] : null);
      input.click();
    });

    if (!file) return;

    const text = await file.text();

    // Detect slide vs prose by filename or frontmatter
    const frontmatterMatch = text.trimStart().match(/^---\r?\n([\s\S]*?)\r?\n---/);
    let isSlides = false;
    if (file.name.endsWith('.slides.md')) {
      isSlides = true;
    } else if (frontmatterMatch && /marp:\s*true/m.test(frontmatterMatch[1])) {
      isSlides = true;
    }

    const filename = await this.store.createFile(file.name, text, isSlides);
    this.showNewFileSnackBar(filename, isSlides);
    this.closeDrawer.emit();
  }

  async onFromClipboard(): Promise<void> {
    // Read text from the clipboard and create a new document from it
    if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
      this.snackBar.open('Clipboard API not available in this browser', 'Dismiss', { duration: 3000 });
      return;
    }

    let text = '';
    try {
      text = await navigator.clipboard.readText();
    } catch (e) {
      console.warn('Failed to read clipboard', e);
      this.snackBar.open('Unable to read clipboard. Grant permission or paste manually.', 'Dismiss', { duration: 4000 });
      return;
    }

    if (!text) {
      this.snackBar.open('Clipboard is empty', 'Dismiss', { duration: 2000 });
      return;
    }

    // Detect slide vs prose by frontmatter
    const frontmatterMatch = text.trimStart().match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const isSlides = !!(frontmatterMatch && /marp:\s*true/m.test(frontmatterMatch[1]));

    const filename = await this.store.createFile('Clipboard.md', text, isSlides);
    this.showNewFileSnackBar(filename, isSlides);
    this.closeDrawer.emit();
  }

  private showNewFileSnackBar(filename: string, isSlides: boolean): void {
    const snackBarRef = this.snackBar.open(`Created ${filename}`, 'Clear content', {
      duration: 5000,
    });

    snackBarRef.onAction().subscribe(() => {
      this.store.setSelectedTab(0);
      if (isSlides) {
        this.store.setMarkdown(`---\nmarp: true\n---\n\n`);
      } else {
        this.store.setMarkdown('');
      }
      setTimeout(() => this.editorService.focus('end'), 50);
    });
  }

  async onDownloadAll(): Promise<void> {
    const files = this.store.fileList();
    if (files.length === 0) {
      this.snackBar.open('No files to export', 'Dismiss', { duration: 2000 });
      return;
    }

    const zip = new JSZip();
    for (const file of files) {
      const content = await this.fs.readFile(file);
      zip.file(file, content);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `folio-export-${new Date().toISOString().split('T')[0]}.zip`;
    link.click();
    URL.revokeObjectURL(url);

    this.snackBar.open(`Exported ${files.length} files to ZIP`, 'Dismiss', { duration: 3000 });
    this.closeDrawer.emit();
  }

  async onFileClick(file: string): Promise<void> {
    await this.store.openFile(file);
    this.closeDrawer.emit();
  }

  async onDelete(event: Event, file: string): Promise<void> {
    event.stopPropagation(); // Don't select the file when deleting

    const content = await this.fs.readFile(file);
    await this.store.deleteFile(file);

    const snackBarRef = this.snackBar.open(`Deleted ${file}`, 'Undo', {
      duration: 5000,
      panelClass: 'undo-snackbar',
    });

    snackBarRef.onAction().subscribe(async () => {
      const isSlides = file.endsWith('.slides.md');
      await this.store.createFile(file, content, isSlides);
    });
  }

  onShowSettings(): void {
    this.dialog.open(SettingsDialogComponent, {
      width: 'min(95vw, 600px)',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'folio-settings-dialog',
      autoFocus: false,
    });
    this.closeDrawer.emit();
  }
}
