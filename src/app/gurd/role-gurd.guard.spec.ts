import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleGurdGuard } from './role-gurd.guard';

describe('roleGurdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleGurdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
