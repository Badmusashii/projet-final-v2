import { TestBed } from '@angular/core/testing';

import { GetplatformsService } from './getplatforms.service';

describe('GetplatformsService', () => {
  let service: GetplatformsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetplatformsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
