import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  imports: [AuthRoutingModule, SharedModule],
  declarations: [LoginComponent, RegisterComponent]
})
export class AuthModule {}
