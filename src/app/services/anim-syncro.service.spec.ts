import { TestBed } from '@angular/core/testing';

import { AnimSyncroService } from './anim-syncro.service';

describe('AnimSyncroService', () => {
  let service: AnimSyncroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimSyncroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
