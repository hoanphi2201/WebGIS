import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from '@app/core';
const routes: Routes = [
    {
      path: '',
      redirectTo: '/admin/users',
      pathMatch: 'full'
    },
    {
      path: '',
      children: [
        {
          path: 'users',
          canActivate: [AuthGuard],
          component: UsersComponent
        }
      ]
    }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class MaintenancesRoutingModule { }
