import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DealerService {
  private base = 'http://127.0.0.1:8000/api/dealers/';

  constructor(private http: HttpClient) {}

  getDealers(): Observable<any[]> {
    return this.http.get<any[]>(this.base);
  }

  getDealer(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}${id}/`);
  }
}
