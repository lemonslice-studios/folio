import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { FileListDrawerComponent } from './file-list-drawer';
import {
  AppStore,
  MINIMAL_SLIDES_MARKDOWN,
  SAMPLE_MARKDOWN,
  SAMPLE_PROSE,
} from '../store/app-store';
import { FsService } from '../services/fs.service';
import { EditorService } from '../services/editor.service';

describe('FileListDrawerComponent - Starter Content', () => {
  let component: FileListDrawerComponent;
  let store: AppStore;
  let createFileSpy: any;

  beforeEach(async () => {
    const fsServiceMock = {
      init: vi.fn().mockResolvedValue(undefined),
      listFiles: vi.fn().mockResolvedValue([]),
      readFile: vi.fn().mockResolvedValue(''),
      writeFile: vi.fn().mockResolvedValue(undefined),
      exists: vi.fn().mockResolvedValue(false),
    };

    const snackBarMock = {
      open: vi.fn().mockReturnValue({
        onAction: () => of(),
      }),
    };

    const dialogMock = {
      open: vi.fn(),
    };

    const editorServiceMock = {
      focus: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [FileListDrawerComponent],
      providers: [
        AppStore,
        { provide: FsService, useValue: fsServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: EditorService, useValue: editorServiceMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FileListDrawerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(AppStore);
    createFileSpy = vi.spyOn(store, 'createFile').mockResolvedValue('test.md');
  });

  it('uses SAMPLE_MARKDOWN and SAMPLE_PROSE when includeStarterContent is true', async () => {
    store.setIncludeStarterContent(true);

    await component.onNewSlides();
    expect(createFileSpy).toHaveBeenCalledWith('Untitled Slides.slides.md', SAMPLE_MARKDOWN, true);

    await component.onNewProse();
    expect(createFileSpy).toHaveBeenCalledWith('Untitled Document.md', SAMPLE_PROSE, false);
  });

  it('uses MINIMAL_SLIDES_MARKDOWN and empty string when includeStarterContent is false', async () => {
    store.setIncludeStarterContent(false);

    await component.onNewSlides();
    expect(createFileSpy).toHaveBeenCalledWith(
      'Untitled Slides.slides.md',
      MINIMAL_SLIDES_MARKDOWN,
      true,
    );

    await component.onNewProse();
    expect(createFileSpy).toHaveBeenCalledWith('Untitled Document.md', '', false);
  });
});
