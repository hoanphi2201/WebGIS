import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }
  getUserList(page: number, pageSize: number, sort_field?: string, sort_type?: string): Observable<any> {
    let param = '';
    param = '?page=' + page + '&pageSize=' + pageSize;
    if (sort_field) {
      param = param + '&sort_field=' + sort_field + '&sort_type=' + sort_type;
    }
    return this.apiService.get('/users' + param);
  }
  addUser(user: any): Observable<any> {
    return this.apiService.post('/users', user);
  }
  updateUser(user: any, userId: number): Observable<any> {
    return this.apiService.put(`/users/${userId}`, user);
  }
  deleteUser(userId: number): Observable<any> {
    return this.apiService.delete(`/users/${userId}`);
  }
  deleteMultyUser(param: any): Observable<any> {
    return this.apiService.post('/users/delete-multy', param);
  }
}
