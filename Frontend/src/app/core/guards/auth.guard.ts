import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Logger } from '../logger.service';
import { NzMessageService } from 'ng-zorro-antd';
const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router, private authService: AuthService,
    private nzMessageService: NzMessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    return this.checkLogin(url, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route, state: RouterStateSnapshot): boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url, state);
  }

  private checkLogin(url: string, state: any): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    log.debug('Not authenticated, redirecting and adding redirect url...');
    this.authService.logout();
    this.nzMessageService.success('Sign in to continue');
    this.router.navigate(['/auth/login'], { queryParams: { redirect: state.url }, replaceUrl: true });
    return false;
  }
}
