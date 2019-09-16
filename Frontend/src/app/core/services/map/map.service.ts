import { Injectable } from '@angular/core';
import { ApiService } from '@app/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(private apiService: ApiService) {}

  getKeywordMap(from?: string) {
    let param = '';
    if (from) {
      param = param + '&from=' + from;
    }
    return this.apiService.get('/keywords/map' + param);
  }
}
