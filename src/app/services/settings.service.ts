import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API_BASE } from './api-base.token';
import { INITIAL_SETTINGS } from './initial-data.tokens';

export interface SiteSettings {
  heroImage: string;
  heroPriceLabel: string;
  whatsappNumber: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private initialSettings = inject(INITIAL_SETTINGS);

  private url = () => `${this.base}/api/settings`;

  get(): Observable<SiteSettings> {
    if (this.initialSettings !== null) return of(this.initialSettings);
    return this.http.get<SiteSettings>(this.url());
  }

  update(s: Partial<SiteSettings>): Observable<SiteSettings> {
    return this.http.put<SiteSettings>(this.url(), s);
  }
}
