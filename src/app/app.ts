import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditorPaneComponent } from './editor-pane/editor-pane';
import { PreviewPaneComponent } from './preview-pane/preview-pane';
import { AppStore } from './store/app-store';

const COLOR_SCHEME_ICON: Record<string, string> = {
  system: 'brightness_auto',
  light:  'light_mode',
  dark:   'dark_mode',
};

const COLOR_SCHEME_LABEL: Record<string, string> = {
  system: 'Color scheme: automatic (click to switch)',
  light:  'Color scheme: light (click to switch)',
  dark:   'Color scheme: dark (click to switch)',
};

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CdkDrag,
    EditorPaneComponent,
    PreviewPaneComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-root' },
})
export class App {
  protected readonly store = inject(AppStore);
  private readonly splitPane = viewChild<ElementRef<HTMLDivElement>>('splitPane');

  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isWide = toSignal(
    this.breakpointObserver.observe('(min-width: 840px)').pipe(
      map(r => r.matches),
    ),
    { initialValue: false },
  );

  protected readonly colorSchemeIcon = computed(
    () => COLOR_SCHEME_ICON[this.store.colorScheme()],
  );

  protected readonly colorSchemeLabel = computed(
    () => COLOR_SCHEME_LABEL[this.store.colorScheme()],
  );

  protected readonly isDragging = signal(false);

  protected onDragStart(): void {
    this.isDragging.set(true);
  }

  protected onDragEnd(): void {
    this.isDragging.set(false);
  }

  protected onResize(event: CdkDragMove): void {
    const pane = this.splitPane()?.nativeElement;
    if (!pane) return;

    const rect = pane.getBoundingClientRect();
    const newWidth = event.pointerPosition.x - rect.left;

    this.store.setEditorWidth(newWidth);
    // Reset the drag transform so the divider stays synced with the grid
    event.source.reset();
  }

  constructor() {
    // Reflect the chosen color scheme on <html> so CSS selectors and Material
    // theme rules can respond without a page reload.
    effect(() => {
      const scheme = this.store.colorScheme();
      const html = document.documentElement;
      if (scheme === 'system') {
        html.removeAttribute('data-color-scheme');
      } else {
        html.setAttribute('data-color-scheme', scheme);
      }
    });
  }
}
