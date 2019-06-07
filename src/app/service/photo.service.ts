import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PhotoService {

    host = `${environment.URL}`;

    constructor(private http: HttpClient) {
    }
    getPhotos(id: number): Observable<any> {
        return this.http.get(this.host + 'voyage/picture/' + id);
    }
    getpath(): Observable<any> {
        return this.http.get(this.host + 'photo/path');
    }
    deletePhoto(id: number) {
        return this.http.delete(this.host + 'photo/delete/' + id);
    }
}
