import { TestBed } from '@angular/core/testing';

import { WindowresizeService } from './windowresize.service';

describe('WindowresizeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WindowresizeService = TestBed.get(WindowresizeService);
    expect(service).toBeTruthy();
  });
});
