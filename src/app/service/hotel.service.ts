import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Hotel} from '../modeles/hotel/hotel';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  host = `${environment.URL}`;

  constructor(private http: HttpClient) {
  }
  getAllHotels(): Observable<any> {
    return this.http.get(this.host + 'hotel');
  }

  addHotel(hotel: Hotel): Observable<any> {
    return this.http.post(this.host + 'hotel/add', hotel);

  }
  updateHotel(hotel: Hotel): Observable<any>  {
    return this.http.put(this.host + 'hotel/update/' + hotel.id, hotel);
  }
  deleteHotel(hotel: Hotel) {
    return this.http.delete(this.host + 'hotel/delete/' + hotel.id);
  }

  getHotelById(hotel: Hotel): Observable<any> {
    return this.http.get(this.host + 'hotel/' + hotel.id);
  }
}
