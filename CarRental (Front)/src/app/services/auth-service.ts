import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface TokenPair {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.hasValidAccessToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<TokenPair> {
    return this.http
      .post<TokenPair>(`${this.apiUrl}/login/`, { email, password })
      .pipe(tap((tokens) => this.saveTokens(tokens)));
  }

  register(email: string, password: string, password2: string, fullName?: string) {
    const payload: any = { email, password, password2 };
    if (fullName) payload.full_name = fullName;
    return this.http.post(`${this.apiUrl}/register/`, payload);
  }

  saveTokens(tokens: TokenPair): void {
    if (tokens.access) localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) localStorage.setItem('refresh_token', tokens.refresh);
    this.loggedIn.next(true);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  logout(): void {
    this.clearTokens();
  }

  getUserFromAccessToken(): any | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      return null;
    }
  }

  private hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    try {
      const payload: any = jwtDecode(token);
      if (!payload.exp) return false;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now + 10;
    } catch {
      return false;
    }
  }
}
