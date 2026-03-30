import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { INITIAL_CATALOG } from './services/initial-data.tokens';
import { INITIAL_SETTINGS } from './services/initial-data.tokens';
import type { SiteSettings } from './services/settings.service';
import type { CatalogItem } from './data/catalog-data';

function readJson<T>(path: string, fallback: T): T {
  try {
    if (existsSync(path)) return JSON.parse(readFileSync(path, 'utf-8')) as T;
  } catch {}
  return fallback;
}

const dataDir = join(process.cwd(), 'data');
const defaultSettings: SiteSettings = { heroImage: '/modelo1.jpg', heroPriceLabel: 'R$ 79,90', whatsappNumber: '' };

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: INITIAL_CATALOG,
      useFactory: () => readJson<CatalogItem[]>(join(dataDir, 'catalog.json'), []),
    },
    {
      provide: INITIAL_SETTINGS,
      useFactory: () => readJson<SiteSettings>(join(dataDir, 'settings.json'), defaultSettings),
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
