import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canNavigateGuard } from './can-navigate.guard';

describe('canNavigateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canNavigateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
