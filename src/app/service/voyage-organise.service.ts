import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Planning} from '../modeles/planning/planning';
import {VoyageOrganise} from '../modeles/voyage/voyage-organise';
import {Hotel} from '../modeles/hotel/hotel';

@Injectable({
  providedIn: 'root'
})
export class VoyageOrganiseService {

  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }

  getAllVoyages(): Observable<any> {
    return this.http.get(this.host + 'voyage/');
  }

  addVoyage(voyage: VoyageOrganise): Observable<any> {
    return this.http.post(this.host + 'voyage/add', voyage);

  }

  updateVoyage(id: number, voyage: VoyageOrganise): Observable<any> {
    return this.http.put(this.host + 'voyage/update/' + id, voyage);
  }

  deleteVoyage(id: number): Observable<any> {
    return this.http.delete(this.host + 'voyage/delete/' + id);
  }

  getVoyageById(voyage: VoyageOrganise): Observable<any> {
    return this.http.get(this.host + 'voyage/' + voyage.id);
  }

  affectationPhoto(id: number, voyage: VoyageOrganise): Observable<any> {
        return this.http.put(this.host + 'voyage/photos/' + id , voyage);
    }
  getVoyageByIdNumber(id: number): Observable<any> {
        return this.http.get(this.host + 'voyage/' + id);
    }
    getCategoriesByVoyage(id: number): Observable<any> {
        return this.http.get(this.host + 'voyage/categorie/' + id);
    }
    getPhotoOfVoyage(id: number): Observable<any> {
      return this.http.get(this.host + 'voyage/photo/' + id);
    }
    getVoyageNonArchive(): Observable<any> {
      return this.http.get(this.host + 'voyage/visible');
    }
    getVoyageArchive(): Observable<any> {
        return this.http.get(this.host + 'voyage/archive');
    }
    archiverVoyage(id: number, voyage: VoyageOrganise): Observable<any> {
        return this.http.put(this.host + 'voyage/archive/' + id , voyage);
    }
    invisibleVoyage(id: number, voyage: VoyageOrganise): Observable<any> {
        return this.http.put(this.host + 'voyage/invisiblesite/' + id , voyage);
    }
    visibleVoyage(id: number, voyage: VoyageOrganise): Observable<any> {
        return this.http.put(this.host + 'voyage/visiblesite/' + id , voyage);
    }
}
