import { Component, OnInit } from '@angular/core';
import { SettingDrawerService } from '@app/shared';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  collapedSideBarDesktop: boolean;
  collapedSideBarMobile: boolean;
  headerColor: string;
  sideNavDark: boolean;
  constructor(private settingDrawerService: SettingDrawerService) {}

  ngOnInit() {
    this.settingDrawerService.getHeaderColor().subscribe(res => {
      this.headerColor = 'is-' + res;
    });
    this.settingDrawerService.getSideNavDark().subscribe(res => {
      this.sideNavDark = res;
    });
  }
  receiveCollapsedDesktop($event: any) {
    this.collapedSideBarDesktop = $event;
  }
  receiveCollapsedMobile($event: any) {
    this.collapedSideBarDesktop = false;
    this.collapedSideBarMobile = $event;
  }
  ngOnDestroy() {}
  displaySideBar() {
    return {
      'is-folded': this.collapedSideBarDesktop,
      'is-expand': this.collapedSideBarMobile,
      'is-side-nav-dark': this.sideNavDark
    };
  }

}
