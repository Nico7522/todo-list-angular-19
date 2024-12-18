import { signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface CanQuit {
  canQuit$: Subject<boolean>;
  showModalConfirmation: () => void;
  isFormUntouched: ReturnType<typeof signal<string>>;
}

export type CanQuitType = boolean | Observable<boolean> | Promise<boolean>;
