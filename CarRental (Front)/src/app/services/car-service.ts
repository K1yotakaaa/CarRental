import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Car } from '../cars';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private baseUrl = `${environment.apiBaseUrl}/api/cars/`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getCars(params?: any): Observable<Car[]> {
    const query = params ? this.toQueryString(params) : '';
    return this.http.get<Car[]>(this.baseUrl + query);
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.baseUrl}${id}/`);
  }

  addCar(carData: FormData | { [k: string]: any }): Observable<any> {
    const headers = this.auth.getAccessToken()
      ? new HttpHeaders({ Authorization: `Bearer ${this.auth.getAccessToken()}` })
      : undefined;
    return this.http.post(this.baseUrl, carData, { headers });
  }

  updateCar(id: number, carData: FormData | { [k: string]: any }): Observable<any> {
    const headers = this.auth.getAccessToken()
      ? new HttpHeaders({ Authorization: `Bearer ${this.auth.getAccessToken()}` })
      : undefined;
    return this.http.put(`${this.baseUrl}${id}/`, carData, { headers });
  }

  deleteCar(id: number): Observable<any> {
    const headers = this.auth.getAccessToken()
      ? new HttpHeaders({ Authorization: `Bearer ${this.auth.getAccessToken()}` })
      : undefined;
    return this.http.delete(`${this.baseUrl}${id}/`, { headers });
  }

  getCarsByDealerId(dealerId: number, extraParams?: any): Observable<Car[]> {
    const params = { dealer: dealerId, ...(extraParams || {}) };
    return this.getCars(params);
  }

  searchCars(term: string, ordering?: string): Observable<Car[]> {
    const params: any = { search: term };
    if (ordering) params.ordering = ordering;
    return this.getCars(params);
  }

  private toQueryString(params: any): string {
    const esc = encodeURIComponent;
    const query = Object.keys(params)
      .map((k) => `${esc(k)}=${esc(params[k])}`)
      .join('&');
    return query ? `?${query}` : '';
  }
}
