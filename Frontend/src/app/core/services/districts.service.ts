import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictsService {

  constructor(private apiService: ApiService) { }
  getdistricts(): Observable<any> {
    return this.apiService.get('/districts');
  }
  getdistrictInfo(district_id: string): Observable<any> {
    return this.apiService.get('/districts/info?district_id=' + district_id);
  }
  getdistrictGeo(district_id: string): Observable<any> {
    return this.apiService.get('/districts/geo-json?district_id=' + district_id);
  }
  updateDistrictInfo(district_id: number, district_info: any): Observable<any> {
    return this.apiService.put('/districts/update-info/' + district_id, {district_info});
  }

}
