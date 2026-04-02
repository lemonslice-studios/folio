import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AppStore } from '../store/app-store';
import { FsService } from '../services/fs.service';

@Component({
  selector: 'app-presentation-list-drawer',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './presentation-list-drawer.html',
  styleUrl: './presentation-list-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationListDrawerComponent {
  protected readonly store = inject(AppStore);
  protected readonly fs = inject(FsService);
  private readonly snackBar = inject(MatSnackBar);

  async onNewPresentation(): Promise<void> {
    await this.store.createFile('Untitled.md');
  }

  async onFileClick(file: string): Promise<void> {
    await this.store.openFile(file);
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
      await this.store.createFile(file, content);
    });
  }
}
