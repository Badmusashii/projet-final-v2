import { TestBed } from '@angular/core/testing';

import { StoreInitializerServiceService } from './store-initializer-service.service';

describe('StoreInitializerServiceService', () => {
  let service: StoreInitializerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreInitializerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
