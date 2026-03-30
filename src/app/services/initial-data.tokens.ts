import { InjectionToken } from '@angular/core';
import type { CatalogItem } from '../data/catalog-data';
import type { SiteSettings } from './settings.service';

export const INITIAL_CATALOG = new InjectionToken<CatalogItem[] | null>('INITIAL_CATALOG', {
  providedIn: 'root',
  factory: () => null,
});

export const INITIAL_SETTINGS = new InjectionToken<SiteSettings | null>('INITIAL_SETTINGS', {
  providedIn: 'root',
  factory: () => null,
});
