import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SettingDrawerService } from '@app/shared';
import { AuthService } from '@app/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() collapsedDesktopEvent = new EventEmitter<boolean>();
  @Output() collapsedMobileEvent = new EventEmitter<boolean>();
  isCollapsedDesktop = false;
  isCollapsedMobile = false;
  currentUser: any;
  constructor(
    private router: Router,
    private settingDrawerService: SettingDrawerService,
    private nzMessageService: NzMessageService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.settingDrawerService.getFoldedMenu().subscribe(res => {
      this.isCollapsedDesktop = res;
      this.collapsedDesktopEvent.emit(this.isCollapsedDesktop);
    });
    this.authService.currentUser.subscribe(userData => {
      this.currentUser = userData;
    });
  }
  toggleCollapsedDesktop() {
    this.isCollapsedDesktop = !this.isCollapsedDesktop;
    this.collapsedDesktopEvent.emit(this.isCollapsedDesktop);
  }

  toggleCollapsedMobile() {
    this.isCollapsedMobile = !this.isCollapsedMobile;
    this.collapsedMobileEvent.emit(this.isCollapsedMobile);
  }

  openThemeConfig(): void {
    this.settingDrawerService.setVisible(true);
  }
  logout() {
    this.authService.logout().subscribe(success => {
      this.router.navigate(['/login']);
      this.nzMessageService.success('Logout success');
    });
  }
}
