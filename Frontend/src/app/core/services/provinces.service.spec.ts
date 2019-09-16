/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProvincesService } from './provinces.service';

describe('Service: Provinces', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvincesService]
    });
  });

  it('should ...', inject([ProvincesService], (service: ProvincesService) => {
    expect(service).toBeTruthy();
  }));
});
