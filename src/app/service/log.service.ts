import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LogModel} from '../modeles/log.model';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LogService {
    host = `${environment.URL}`;

    constructor(private http: HttpClient) {
    }
    enregisterLog(log: LogModel): Observable<any> {
        return this.http.post(this.host + 'log/add', log);
    }
    getLogs(): Observable<any> {
        return this.http.get(this.host + 'log/');
    }
}
