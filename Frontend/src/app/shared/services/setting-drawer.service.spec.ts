/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SettingDrawerService } from './setting-drawer.service';

describe('Service: SettingDrawer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingDrawerService]
    });
  });

  it('should ...', inject([SettingDrawerService], (service: SettingDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
