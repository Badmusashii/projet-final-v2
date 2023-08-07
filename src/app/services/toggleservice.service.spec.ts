import { TestBed } from '@angular/core/testing';

import { ToggleserviceService } from './toggleservice.service';

describe('ToggleserviceService', () => {
  let service: ToggleserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToggleserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
