import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { API_BASE } from './api-base.token';

const TOKEN_KEY = 'admin_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private platformId = inject(PLATFORM_ID);

  isLoggedIn = signal(this.checkToken());

  private checkToken(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
      // Decode without verification — just check expiry client-side
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  login(password: string): Observable<void> {
    return this.http
      .post<{ token: string }>(`${this.base}/api/auth/login`, { password })
      .pipe(
        tap(({ token }) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(TOKEN_KEY, token);
          }
          this.isLoggedIn.set(true);
        }),
        map(() => undefined)
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }
}
