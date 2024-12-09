import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { canQuitGuard } from './can-quit.guard';

describe('canQuitGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canQuitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
