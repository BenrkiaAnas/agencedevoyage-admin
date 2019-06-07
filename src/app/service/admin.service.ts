import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AdminModel} from '../modeles/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(this.host + 'admin');
  }

  getOne(admin): Observable<any> {
    return this.http.get(this.host + 'admin/show/' + admin);
  }

  addAdmin(admin: any): Observable<any> {
    return this.http.post(this.host + 'admin', admin);
  }

  updateAdmin(admin: AdminModel): Observable<any> {
    return this.http.put(this.host + 'admin/' + admin.id, admin);
  }

  deleteAdmin(admin: AdminModel): Observable<any> {
    return this.http.delete(this.host + 'admin/remove/' + admin.id);
  }

  blockAdmin(admin: AdminModel): Observable<any> {
    return this.http.put(this.host + 'admin/block/' + admin.id, admin);
  }

  deblockAdmin(admin: AdminModel): Observable<any> {
    return this.http.put(this.host + 'admin/deblock/' + admin.id, admin);
  }
  getRole(id: number): Observable<any> {
    return this.http.get(this.host + 'admin/role/' + id);
  }
}
