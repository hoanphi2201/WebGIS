import { NgModule } from '@angular/core';
import { UsersComponent } from './pages/users/users.component';
import { SharedModule } from '@app/shared';
import { MaintenancesRoutingModule } from './maintenances-routing.module';

@NgModule({
  imports: [MaintenancesRoutingModule, SharedModule],
  declarations: [UsersComponent]
})
export class MaintenancesModule { }
