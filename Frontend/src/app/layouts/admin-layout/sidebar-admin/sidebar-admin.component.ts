import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SettingDrawerService } from '@app/shared';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent implements OnInit, OnDestroy {
  @Input() isCollapsed: boolean;
  sideNavDark: boolean;
  
  constructor(
    private settingDrawerService: SettingDrawerService
  ) {}

  ngOnInit() {
    this.settingDrawerService.getSideNavDark().subscribe(res => {
      this.sideNavDark = res;
    });
    
  }
  ngOnDestroy() {}
}
