import { FooterComponent } from './footer/footer.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ContentLayoutComponent } from './content-layout/content-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarContentComponent } from './content-layout/sidebar-content/sidebar-content.component';
import { FullScreenComponent } from './header/components/fullscreen.component';
import { I18nComponent } from './header/components/i18n.component';
import { StorageComponent } from './header/components/storage.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { SidebarAdminComponent } from './admin-layout/sidebar-admin/sidebar-admin.component';

const ADMIN_LAYOUT = [
  ContentLayoutComponent,
  FooterComponent,
  HeaderComponent,
  SidebarContentComponent,
  FullScreenComponent,
  I18nComponent,
  StorageComponent,
  AdminLayoutComponent,
  SidebarAdminComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [AuthLayoutComponent, ...ADMIN_LAYOUT],
  exports: [AuthLayoutComponent, ...ADMIN_LAYOUT]
})
export class LayoutsModule {}
