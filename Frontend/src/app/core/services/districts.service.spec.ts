/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DistrictsService } from './districts.service';

describe('Service: Districts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistrictsService]
    });
  });

  it('should ...', inject([DistrictsService], (service: DistrictsService) => {
    expect(service).toBeTruthy();
  }));
});
