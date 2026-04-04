import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EditorService {
  private readonly insertSubject = new Subject<string>();
  
  /** Observable that emits whenever a snippet should be inserted at the cursor. */
  readonly insert$ = this.insertSubject.asObservable();

  /** Triggers an insertion of the given text into the active editor. */
  insert(text: string): void {
    this.insertSubject.next(text);
  }
}
