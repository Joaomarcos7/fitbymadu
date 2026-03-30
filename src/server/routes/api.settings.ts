import { Router } from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { requireAuth } from '../middleware/auth.middleware.js';

export interface SiteSettings {
  heroImage: string;
  heroPriceLabel: string;
  whatsappNumber: string;
}

const router = Router();

function settingsPath() {
  return join(process.cwd(), 'data/settings.json');
}

function readSettings(): SiteSettings {
  return JSON.parse(readFileSync(settingsPath(), 'utf-8')) as SiteSettings;
}

function writeSettings(s: SiteSettings): void {
  writeFileSync(settingsPath(), JSON.stringify(s, null, 2), 'utf-8');
}

router.get('/', (_req, res) => {
  res.json(readSettings());
});

router.put('/', requireAuth, (req, res) => {
  const current = readSettings();
  const updated: SiteSettings = { ...current, ...(req.body as Partial<SiteSettings>) };
  writeSettings(updated);
  res.json(updated);
});

export default router;
