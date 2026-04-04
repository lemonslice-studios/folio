import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditorService } from '../services/editor.service';

interface HelpItem {
  label: string;
  snippet: string;
  description: string;
}

interface HelpSection {
  title: string;
  items: HelpItem[];
}

const HELP_SECTIONS: HelpSection[] = [
  {
    title: 'Basics',
    items: [
      { label: 'Heading 1', snippet: '# ', description: 'Main title' },
      { label: 'Heading 2', snippet: '## ', description: 'Section title' },
      { label: 'Bold', snippet: '**text**', description: 'Strong emphasis' },
      { label: 'Italic', snippet: '*text*', description: 'Light emphasis' },
      { label: 'List', snippet: '- item', description: 'Bulleted list' },
      { label: 'Link', snippet: '[label](url)', description: 'Hyperlink' },
    ]
  },
  {
    title: 'Slides',
    items: [
      { label: 'New Slide', snippet: '\n---\n', description: 'Horizontal separator' },
      { label: 'Paginate', snippet: 'paginate: true', description: 'Enable slide numbers' },
      { label: 'Front Matter', snippet: '---\nmarp: true\ntheme: default\n---', description: 'Presentation config' },
      { label: 'Comments', snippet: '<!-- speaker notes -->', description: 'Presenter-only notes' },
    ]
  },
  {
    title: 'Directives',
    items: [
      { label: 'Theme', snippet: 'theme: gaia', description: 'Built-in themes: default, gaia, uncover' },
      { label: 'Class', snippet: '<!-- _class: lead -->', description: 'Apply style to current slide' },
      { label: 'Background', snippet: 'backgroundColor: #f0f0f0', description: 'Solid slide color' },
      { label: 'Color', snippet: 'color: #333', description: 'Default text color' },
    ]
  },
  {
    title: 'Images',
    items: [
      { label: 'Image', snippet: '![alt](url)', description: 'Standard image' },
      { label: 'Background', snippet: '![bg](url)', description: 'Full-bleed slide background' },
      { label: 'BG Right', snippet: '![bg right](url)', description: 'Split background (right half)' },
      { label: 'BG 50%', snippet: '![bg left:50%](url)', description: 'Resize background area' },
    ]
  }
];

@Component({
  selector: 'app-help-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './help-dialog.html',
  styleUrl: './help-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpDialogComponent {
  protected readonly sections = HELP_SECTIONS;
  private readonly editorService = inject(EditorService);
  private readonly dialogRef = inject(MatDialogRef<HelpDialogComponent>);

  protected insert(snippet: string): void {
    this.editorService.insert(snippet);
  }

  protected close(): void {
    this.dialogRef.close();
  }
}
