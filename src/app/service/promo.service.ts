import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Promo} from '../modeles/promotion/promo';
import {Planning} from "../modeles/planning/planning";

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }

  getAllVisiblePromos(dtBegin, dtEnd, visible): Observable<any> {
    return this.http.post(this.host + 'promo/byDateInterval', {'dateBegin': dtBegin, 'dateEnd': dtEnd, 'visible': visible});
  }

  getAllPromo(): Observable<any> {
    return this.http.get(this.host + 'promo/');
  }

  addPromo(promo: Promo): Observable<any> {
    return this.http.post(this.host + 'promo/add', promo);

  }

  updatePromo(promo: Promo): Observable<any> {
    return this.http.put(this.host + 'promo/update/' + promo.id, promo);
  }

  deletePromo(promo: Promo) {
    return this.http.delete(this.host + 'promo/delete/' + promo.id);
  }

  visibilityPromo(promo : Promo)
  {
    return this.http.put(this.host + 'promo/visible/' + promo.id , promo);
  }

  affectPromoToPlannings(promo: Promo, plannings: Planning[]): Observable<any> {

    return this.http.post(this.host + 'promo/addPromoToMultiplePlanning/' + promo.id ,{ 'planning' : plannings} );

  }

  getAllVisiblePromoForPlanning(): Observable<any> {
    return this.http.get(this.host + "promo/findVisible/1");
  }

  checkUsingPromoForPlanning(promo: Promo): Observable<any> {
    return this.http.post(this.host + 'promo/checkUsingPromo/' + promo.id , promo);
  }

  setDateExpirationPromo(): Observable<any>
  {
      return this.http.get(this.host + 'promo/verifyDateExpirationPromo');
  }
}
