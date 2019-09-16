import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Logger } from '../logger.service';
const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole();
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole();
  }
  private checkRole(): boolean {
    let currentUser: any;
    this.authService.currentUser.subscribe(userData => {
      currentUser = userData;
    });
    if (currentUser && currentUser.role === 'admin') {
      return true;
    }
    log.debug('Not is a admin, redirecting to dashboard');
    this.router.navigate(['/dashboard']);
    return false;
  }
}
