import { Router } from 'express';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { requireAuth } from '../middleware/auth.middleware.js';
import type { CatalogItem } from '../../app/data/catalog-data.js';

const router = Router();

function catalogPath() {
  return join(process.cwd(), 'data/catalog.json');
}

function readCatalog(): CatalogItem[] {
  return JSON.parse(readFileSync(catalogPath(), 'utf-8')) as CatalogItem[];
}

function writeCatalog(items: CatalogItem[]): void {
  writeFileSync(catalogPath(), JSON.stringify(items, null, 2), 'utf-8');
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

router.get('/', (_req, res) => {
  res.json(readCatalog());
});

router.get('/:id', (req, res) => {
  const items = readCatalog();
  const item = items.find((i) => i.id === Number(req.params['id']));
  if (!item) { res.status(404).json({ error: 'Not found' }); return; }
  res.json(item);
});

router.post('/', requireAuth, (req, res) => {
  const items = readCatalog();
  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  const body = req.body as Omit<CatalogItem, 'id' | 'slug'>;
  const newItem: CatalogItem = { ...body, id: nextId, slug: slugify(body.title) };
  items.push(newItem);
  writeCatalog(items);
  res.status(201).json(newItem);
});

router.put('/:id', requireAuth, (req, res) => {
  const items = readCatalog();
  const idx = items.findIndex((i) => i.id === Number(req.params['id']));
  if (idx === -1) { res.status(404).json({ error: 'Not found' }); return; }
  const updated: CatalogItem = {
    ...items[idx],
    ...(req.body as Partial<CatalogItem>),
    id: items[idx].id,
    slug: slugify((req.body as Partial<CatalogItem>).title ?? items[idx].title),
  };
  items[idx] = updated;
  writeCatalog(items);
  res.json(updated);
});

router.delete('/:id', requireAuth, (req, res) => {
  const items = readCatalog();
  const filtered = items.filter((i) => i.id !== Number(req.params['id']));
  if (filtered.length === items.length) { res.status(404).json({ error: 'Not found' }); return; }
  writeCatalog(filtered);
  res.json({ ok: true });
});

export default router;
