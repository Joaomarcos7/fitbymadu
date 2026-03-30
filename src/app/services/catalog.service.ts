import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CatalogItem } from '../data/catalog-data';
import { API_BASE } from './api-base.token';
import { INITIAL_CATALOG } from './initial-data.tokens';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private http = inject(HttpClient);
  private base = inject(API_BASE);
  private initialCatalog = inject(INITIAL_CATALOG);

  private url(path = '') {
    return `${this.base}/api/catalog${path}`;
  }

  getAll(): Observable<CatalogItem[]> {
    if (this.initialCatalog !== null) return of(this.initialCatalog);
    return this.http.get<CatalogItem[]>(this.url());
  }

  getOne(id: number): Observable<CatalogItem> {
    if (this.initialCatalog !== null) {
      const item = this.initialCatalog.find((i) => i.id === id);
      if (item) return of(item);
    }
    return this.http.get<CatalogItem>(this.url(`/${id}`));
  }

  create(item: Omit<CatalogItem, 'id' | 'slug'>): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(this.url(), item);
  }

  update(id: number, item: Partial<CatalogItem>): Observable<CatalogItem> {
    return this.http.put<CatalogItem>(this.url(`/${id}`), item);
  }

  delete(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(this.url(`/${id}`));
  }
}
