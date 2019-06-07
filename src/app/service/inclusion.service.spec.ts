import { TestBed } from '@angular/core/testing';

import { InclusionService } from './inclusion.service';

describe('InclusionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InclusionService = TestBed.get(InclusionService);
    expect(service).toBeTruthy();
  });
});
