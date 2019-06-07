import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Categorie} from '../modeles/categorie/categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }
  getAllCategories(): Observable<any> {
    return this.http.get(this.host + 'category');
  }

  addCategorie(categorie: Categorie): Observable<any> {
    return this.http.post(this.host + 'category/add', categorie);

  }
  updateCategorie(categorie: Categorie): Observable<any>  {
    return this.http.put(this.host + 'category/update/' + categorie.id, categorie);
  }
  deleteCategorie(categorie: Categorie): Observable<any> {
    return this.http.delete(this.host + 'category/delete/' + categorie.id);
  }
  removeCategoriesVoyage(id: number): Observable<any> {
    return this.http.delete(this.host + 'voyage/removeCategories/' + id);
  }
}
