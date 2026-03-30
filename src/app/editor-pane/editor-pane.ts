import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-editor-pane',
  template: `
    <div class="editor-pane">
      <p class="placeholder" aria-label="Editor placeholder">
        # Start writing...
      </p>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--surface);
      overflow: hidden;
    }

    .editor-pane {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder {
      font-family: var(--font-editor);
      font-size: 1rem;
      color: var(--color-plasma);
      margin: 0;
      opacity: 0.6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorPaneComponent {}
