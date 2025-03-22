import { TestBed } from '@angular/core/testing';

import { CasestudyService } from './casestudy.service';

describe('CasestudyService', () => {
  let service: CasestudyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CasestudyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
