import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Hotel} from '../modeles/hotel/hotel';
import {Planning} from '../modeles/planning/planning';
import {Inclusion} from '../modeles/inclusion/inclusion';
import {Promo} from '../modeles/promotion/promo';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }

  getAllPlannings(): Observable<any> {
    return this.http.get(this.host + 'planning/');
  }

  getAllPlanningsByVisible(visible): Observable<any> {
    return this.http.get(this.host + 'planning/byVisible/' + visible);
  }

  getAllPlanningsByDateInterval(dtBegin, dtEnd): Observable<any> {
    return this.http.post(this.host + 'planning/byDateInterval',{'date-debut': dtBegin, 'date-fin': dtEnd});
  }
  addPlanning(planning: Planning): Observable<any> {
    return this.http.post(this.host + 'planning/add', planning);

  }

  addInclusionToPlanning(planning: Planning, inclusions: Inclusion[]): Observable<any> {
    return this.http.post(this.host + 'planning/addInclusion', {'planning': planning, 'inclusions': inclusions});

  }

  updatePlanning(planning: Planning): Observable<any> {
    return this.http.put(this.host + 'planning/update/' + planning.id, planning);
  }

  setPromoPlanning(planning: Planning, promo: Promo): Observable<any> {
    return this.http.post(this.host + 'planning/addPromoToPlanning/' + planning.id, promo);
  }
  deletePlanning(planning: Planning) {
    return this.http.delete(this.host + 'planning/delete/' + planning.id);
  }

  setVisiblePlanning(planning: Planning) {
    return this.http.post(this.host + 'planning/visible/' + planning.id, planning);
  }

  setIsActiverPlanning(planning: Planning) {
    return this.http.post(this.host + 'planning/activer/' + planning.id, planning);
  }
  getAllPlannningByPromo(dtBegin, dtEnd, visible): Observable<any> {
    return this.http.post(this.host + 'planning/allPlanningByPromo', {
      'dateBegin': dtBegin,
      'dateEnd': dtEnd,
      'visible': visible
    });
  }
}
