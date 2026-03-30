import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-preview-pane',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="preview-pane">
      <p class="placeholder">Slide preview</p>
      <button
        mat-fab
        class="present-fab"
        aria-label="Present slides"
        title="Present"
      >
        <mat-icon>play_arrow</mat-icon>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--surface-container);
      overflow: hidden;
      position: relative;
    }

    .preview-pane {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
    }

    .placeholder {
      font-family: var(--font-ui);
      font-size: 0.875rem;
      color: var(--on-surface);
      margin: 0;
      opacity: 0.4;
    }

    .present-fab {
      position: absolute;
      bottom: 16px;
      right: 16px;
      // Volt fill with dark icon per BRIEF
      --mdc-fab-container-color: var(--color-volt);
      --mdc-fab-icon-color: #18181F;
      --mat-fab-foreground-color: #18181F;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewPaneComponent {}
