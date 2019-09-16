import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private apiService: ApiService) {}

  getAlertLastest(limit?: number): Observable<any> {
    let param = '';
    if (limit) {
      param = param + '?limit=' + limit;
    }
    return this.apiService.get('/alert_histories/lastest' + param);
  }
}
