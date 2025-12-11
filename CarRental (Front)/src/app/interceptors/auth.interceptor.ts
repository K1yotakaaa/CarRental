import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth-service';
import { environment } from '../../environments/environment';

function isExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp <= now + 5;
  } catch {
    return true;
  }
}

async function refresh(refreshToken: string | null): Promise<string | null> {
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${environment.apiBaseUrl}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.access || null;
  } catch {
    return null;
  }
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  console.log('INTERCEPTOR REQUEST:', req.url);
  console.log('HEADERS:', req.headers);
  const auth = inject(AuthService);
  const access = auth.getAccessToken();
  const refreshToken = auth.getRefreshToken();

  const attachToken = (token: string | null, request: HttpRequest<any>) => {
    return token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;
  };

  if (access && !isExpired(access)) {
    return next(attachToken(access, req));
  }

  return from(refresh(refreshToken)).pipe(
    switchMap((newAccess) => {
      if (newAccess) {
        auth.saveTokens({ access: newAccess, refresh: refreshToken || '' });
        const retryReq = attachToken(newAccess, req);
        return next(retryReq);
      }

      auth.logout();
      return next(attachToken(null, req));
    }),
    catchError(() => {
      auth.logout();
      return next(attachToken(null, req));
    })
  );
};
