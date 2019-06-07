import { TestBed } from '@angular/core/testing';

import { VoyageOrganiseService } from './voyage-organise.service';

describe('VoyageOrganiseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoyageOrganiseService = TestBed.get(VoyageOrganiseService);
    expect(service).toBeTruthy();
  });
});
