import { CanDeactivateFn } from '@angular/router';
import { CanQuit, CanQuitType } from '../models/can-quit.interface';

export const canQuitGuard: CanDeactivateFn<CanQuit> = (
  component: CanQuit
): CanQuitType => {
  if (component.formSubmitedAndValid()) return true;
  else {
    let canQuit$ = component.canQuit$;
    component.showModalConfirmation();
    return canQuit$.asObservable();
  }
};
