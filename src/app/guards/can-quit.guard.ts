import { CanDeactivateFn } from '@angular/router';
import { CanQuit, CanQuitType } from '../models/can-quit.interface';

export const canQuitGuard: CanDeactivateFn<CanQuit> = (
  component: CanQuit
): CanQuitType => {
  let canQuit$ = component.canQuit$;
  component.showModalConfirmation();
  return canQuit$.asObservable();
};
