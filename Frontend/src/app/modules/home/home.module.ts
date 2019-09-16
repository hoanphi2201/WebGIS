import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home.component';


@NgModule({
  imports: [HomeRoutingModule, SharedModule],
  declarations: [HomeComponent]
})
export class HomeModule {}
