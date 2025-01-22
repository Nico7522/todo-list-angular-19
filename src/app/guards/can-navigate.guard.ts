import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsersProvider } from '../gateways/ports/users.provider';

export const canNavigateGuard: CanActivateFn = (route, state) => {
  const userProvider = inject(UsersProvider);

  const router = inject(Router);
  if (userProvider.currentUser() || userProvider.role() === 'admin') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
