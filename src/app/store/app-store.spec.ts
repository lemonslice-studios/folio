import { TestBed } from '@angular/core/testing';
import { AppStore, MINIMAL_SLIDES_MARKDOWN, SAMPLE_MARKDOWN, SAMPLE_PROSE } from './app-store';
import { FsService } from '../services/fs.service';
import { PrefsService } from '../services/prefs.service';
import { GoogleDriveService } from '../services/google-drive.service';

describe('AppStore - Starter Content Preference', () => {
  let store: AppStore;
  let fsServiceMock: any;
  let prefsServiceMock: any;

  beforeEach(() => {
    fsServiceMock = {
      init: vi.fn().mockResolvedValue(undefined),
      listFiles: vi.fn().mockResolvedValue([]),
      readFile: vi.fn().mockResolvedValue(''),
      writeFile: vi.fn().mockResolvedValue(undefined),
      exists: vi.fn().mockResolvedValue(false),
    };

    prefsServiceMock = {
      init: vi.fn().mockResolvedValue({
        lastOpenFile: null,
        lastTab: 0,
        preferredTheme: 'default',
        appTheme: 'quiet',
        fontFamily: 'sans-serif',
        editorFontSize: 16,
        darkMode: 'system',
        safariWarningDismissed: false,
        googleDriveFolderId: null,
        googleDriveSyncEnabled: false,
        lastSyncTime: null,
        lastSyncError: null,
        geminiApiKey: null,
        includeStarterContent: true,
      }),
      save: vi.fn().mockResolvedValue(undefined),
    };

    const driveServiceMock = {
      isConnected: false,
    };

    TestBed.configureTestingModule({
      providers: [
        AppStore,
        { provide: FsService, useValue: fsServiceMock },
        { provide: PrefsService, useValue: prefsServiceMock },
        { provide: GoogleDriveService, useValue: driveServiceMock },
      ],
    });

    store = TestBed.inject(AppStore);
  });

  it('should default includeStarterContent to true', () => {
    expect(store.prefs().includeStarterContent).toBe(true);
  });

  it('should update includeStarterContent when setIncludeStarterContent is called', () => {
    store.setIncludeStarterContent(false);
    expect(store.prefs().includeStarterContent).toBe(false);
    expect(prefsServiceMock.save).toHaveBeenCalledWith(
      expect.objectContaining({ includeStarterContent: false }),
    );
  });

  it('should create empty Welcome.md during init if includeStarterContent is false', async () => {
    prefsServiceMock.init.mockResolvedValueOnce({
      lastOpenFile: null,
      lastTab: 0,
      preferredTheme: 'default',
      appTheme: 'quiet',
      fontFamily: 'sans-serif',
      editorFontSize: 16,
      darkMode: 'system',
      safariWarningDismissed: false,
      googleDriveFolderId: null,
      googleDriveSyncEnabled: false,
      lastSyncTime: null,
      lastSyncError: null,
      geminiApiKey: null,
      includeStarterContent: false,
    });

    await store.init();
    expect(fsServiceMock.writeFile).toHaveBeenCalledWith('Welcome.md', '');
  });
});
