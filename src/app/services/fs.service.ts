import { Injectable } from '@angular/core';
import FS from '@isomorphic-git/lightning-fs';

@Injectable({ providedIn: 'root' })
export class FsService {
  private readonly fs = new FS('folio');
  private readonly promises = this.fs.promises;

  async init(): Promise<void> {
    try {
      await this.promises.mkdir('/presentations');
    } catch (e: any) {
      if (e.code !== 'EEXIST') throw e;
    }
  }

  async listPresentations(): Promise<string[]> {
    const files = await this.promises.readdir('/presentations');
    return files.filter(f => f.endsWith('.md'));
  }

  async readFile(filename: string): Promise<string> {
    const data = await this.promises.readFile(`/presentations/${filename}`, { encoding: 'utf8' });
    return data as string;
  }

  async writeFile(filename: string, content: string): Promise<void> {
    await this.promises.writeFile(`/presentations/${filename}`, content, { 
      encoding: 'utf8',
      mode: 0o666 
    });
  }

  async deleteFile(filename: string): Promise<void> {
    await this.promises.unlink(`/presentations/${filename}`);
  }

  async renameFile(oldName: string, newName: string): Promise<void> {
    await this.promises.rename(`/presentations/${oldName}`, `/presentations/${newName}`);
  }

  async exists(filename: string): Promise<boolean> {
    try {
      await this.promises.stat(`/presentations/${filename}`);
      return true;
    } catch {
      return false;
    }
  }
}
