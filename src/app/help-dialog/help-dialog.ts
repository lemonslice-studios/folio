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
    title: 'Advanced MD',
    items: [
      { label: 'Math Inline', snippet: '$E=mc^2$', description: 'KaTeX formula' },
      { label: 'Math Block', snippet: '$$\nI = \\int f(x) dx\n$$', description: 'Centered formula' },
      { label: 'Highlight', snippet: '==text==', description: 'Mark text yellow' },
      { label: 'Footnote', snippet: '[^1]', description: 'Add reference' },
      { label: 'Emoji', snippet: ':rocket:', description: 'Shortcodes support' },
    ]
  },
  {
    title: 'Diagrams',
    items: [
      { label: 'Flowchart', snippet: '```mermaid\ngraph TD\nA[Start] --> B{Decision}\nB -- Yes --> C[End]\nB -- No --> D[Try again]\n```', description: 'Mermaid.js diagram' },
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
    title: 'MarpX Extras',
    items: [
      { label: 'Box', snippet: '<box>\nContent\n</box>', description: 'Styled content box' },
      { label: 'Callout', snippet: '<div class="callout">\nTip!\n</div>', description: 'Attention-grabbing block' },
      { label: 'Columns', snippet: '<div class="multicolumn">\n\nLeft\n\n</div>', description: 'Multicolumn layout' },
      { label: 'Chapter', snippet: '<!-- _class: chapter -->', description: 'Transition slide style' },
      { label: 'Quote', snippet: '<!-- _class: quote -->', description: 'Full-slide blockquote' },
      { label: 'Black Slide', snippet: '<!-- _class: black-slide -->', description: 'Invert to solid black' },
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
