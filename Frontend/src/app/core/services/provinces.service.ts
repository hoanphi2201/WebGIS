import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProvincesService {

  constructor(private apiService: ApiService) { }
  getProvinces(): Observable<any> {
    return this.apiService.get('/provinces');
  }
  getProvinceInfo(province_id: string): Observable<any> {
    return this.apiService.get('/provinces/info?province_id=' + province_id);
  }
  getProvinceGeo(province_id: string): Observable<any> {
    return this.apiService.get('/provinces/geo-json?province_id=' + province_id);
  }
  updateProvinceInfo(province_id: number, province_info: any): Observable<any> {
    return this.apiService.put('/provinces/update-info/' + province_id, {province_info});
  }

}
