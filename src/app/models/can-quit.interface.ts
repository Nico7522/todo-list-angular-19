import { Observable, Subject } from 'rxjs';

export interface CanQuit {
  canQuit$: Subject<boolean>;
  showModalConfirmation: () => void;
}

export type CanQuitType = boolean | Observable<boolean> | Promise<boolean>;
