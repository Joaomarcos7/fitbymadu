import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import 'dotenv/config';
import express from 'express';
import { join } from 'node:path';
import { seed } from './server/seed.js';
import authRouter from './server/routes/api.auth.js';
import catalogRouter from './server/routes/api.catalog.js';
import settingsRouter from './server/routes/api.settings.js';
import uploadRouter from './server/routes/api.upload.js';

// Run seed before anything else (no-op if files already exist)
seed();

const browserDistFolder = join(import.meta.dirname, '../browser');
const uploadsFolder = join(process.cwd(), 'public/uploads');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Parse JSON bodies for API routes
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(uploadsFolder));

// API routes
app.use('/api/auth', authRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

// Serve static Angular build files
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

// Handle all other requests by rendering the Angular application
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
