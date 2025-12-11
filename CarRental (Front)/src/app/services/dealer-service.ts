import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DealerService {
  private base = 'https://carrental.up.railway.app/api/dealers/';

  constructor(private http: HttpClient) {}

  getDealers(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getDealer(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}${id}/`);
  }
}
