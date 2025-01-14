import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FakeUsersProvider } from '../gateways/adapters/fake-users.provider';

export const canNavigateGuard: CanActivateFn = (route, state) => {
  const userProvider = inject(FakeUsersProvider);

  const router = inject(Router);
  if (userProvider.currentUser() || userProvider.role() === 'admin') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
