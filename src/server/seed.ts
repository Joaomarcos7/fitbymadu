import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CATALOG_ITEMS } from '../app/data/catalog-data.js';

export function seed(): void {
  const dataDir = join(process.cwd(), 'data');
  const uploadsDir = join(process.cwd(), 'public/uploads');

  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

  const catalogPath = join(dataDir, 'catalog.json');
  if (!existsSync(catalogPath)) {
    writeFileSync(catalogPath, JSON.stringify(CATALOG_ITEMS, null, 2), 'utf-8');
    console.log('[seed] catalog.json created from static data');
  }

  const settingsPath = join(dataDir, 'settings.json');
  if (!existsSync(settingsPath)) {
    writeFileSync(
      settingsPath,
      JSON.stringify(
        { heroImage: '/modelo1.jpg', heroPriceLabel: 'R$ 79,90', whatsappNumber: '' },
        null,
        2
      ),
      'utf-8'
    );
    console.log('[seed] settings.json created with defaults');
  }
}
