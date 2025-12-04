import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../auth-service';

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
    const res = await fetch('http://127.0.0.1:8000/api/auth/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.access;
  } catch {
    return null;
  }
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);
  const access = auth.getAccessToken();
  const refreshToken = auth.getRefreshToken();

  let modifiedReq = req;
  if (access) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` },
    });
  }

  if (!isExpired(access)) {
    return next(modifiedReq);
  }

  return from(refresh(refreshToken)).pipe(
    switchMap((newAccess) => {
      if (newAccess) {
        auth.saveTokens({ access: newAccess, refresh: refreshToken || '' });

        const retryReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newAccess}` },
        });
        return next(retryReq);
      }

      auth.logout();
      return next(modifiedReq);
    }),
    catchError(() => next(modifiedReq))
  );
};
