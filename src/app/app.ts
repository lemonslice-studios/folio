import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditorPaneComponent } from './editor-pane/editor-pane';
import { PreviewPaneComponent } from './preview-pane/preview-pane';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    EditorPaneComponent,
    PreviewPaneComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-root' },
})
export class App {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isWide = toSignal(
    this.breakpointObserver.observe('(min-width: 840px)').pipe(
      map(r => r.matches),
    ),
    { initialValue: false },
  );
}
