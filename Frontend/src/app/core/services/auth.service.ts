import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, mapTo, tap, distinctUntilChanged, map } from 'rxjs/operators';
import { Tokens, User } from '../../core/models';
import { ApiService } from './api.service';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

  constructor(private http: HttpClient, private apiService: ApiService) {}

  login(user: { username: string; password: string }): Observable<any> {
    return this.apiService.post('/auth/login', user).pipe(
      map(res => {
        if (res.status.code === 200) {
          const decoded: User = jwt_decode(res.results[0].access_token);
          this.currentUserSubject.next(decoded);
          this.storeTokens(res.results[0]);
        }
        return res;
      })
    );
  }

  logout() {
    return this.apiService
      .post(`/auth/logout`, {
        refresh_token: this.getRefreshToken()
      })
      .pipe(
        tap(() => this.doLogoutUser()),
        mapTo(true),
        catchError(error => {
          this.doLogoutUser();
          return of(false);
        })
      );
  }

  populate() {
    if (this.getJwtToken()) {
      const decoded: User = jwt_decode(this.getJwtToken());
      this.currentUserSubject.next(decoded);
    } else {
      this.doLogoutUser();
    }
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
    return this.apiService
      .post(`/auth/refresh_token`, {
        refresh_token: this.getRefreshToken()
      })
      .pipe(
        tap(res => {
          if (res.status.code === 200) {
            this.storeJwtToken(res.results[0].access_token);
          }
        })
      );
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLogoutUser() {
    this.currentUserSubject.next(null);
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
