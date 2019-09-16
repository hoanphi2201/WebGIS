import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';

import { configAPI } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class JsonApiService {
  constructor(private httpClient: HttpClient) {}

  fetch(url: string): Observable<any> {
    return this.httpClient.get(this.getBaseUrl() + configAPI.API_URL + url).pipe(
      delay(100),
      catchError(this.handleError)
    );
  }

  private getBaseUrl() {
    return `${location.protocol}//${location.hostname + (location.port ? ':' + location.port : '')}/`;
  }

  private handleError(error: any) {
    const errorMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    return Observable.throw(errorMsg);
  }
}
