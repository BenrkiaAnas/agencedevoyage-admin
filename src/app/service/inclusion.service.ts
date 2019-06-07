import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Inclusion} from '../modeles/inclusion/inclusion';

@Injectable({
  providedIn: 'root'
})
export class InclusionService {
  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }
  getAllInclusions(): Observable<any> {
    return this.http.get(this.host + 'inclusion');
  }

  addInclusion(inclusion: Inclusion): Observable<any> {
    return this.http.post(this.host + 'inclusion/add', inclusion);

  }
  updateInclusion(inclusion: Inclusion): Observable<any>  {
    return this.http.put(this.host + 'inclusion/update/' + inclusion.id, inclusion);
  }
  deleteInclusion(inclusion: Inclusion) {
    return this.http.delete(this.host + 'inclusion/delete/' + inclusion.id);
  }
}
