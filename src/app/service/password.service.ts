import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PasswordService {

    host = `${environment.URL}`;
    constructor(private http: HttpClient) {
    }
    id = localStorage.getItem('id');
    passwordchange(admin: string): Observable<any> {
        return this.http.put(this.host + 'admin/password/' + this.id, admin);
    }
    checkpassword(admin: string): Observable<any> {
        return this.http.post(this.host + 'checkPassword/' + this.id, admin);
    }
}
