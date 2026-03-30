# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:4200/
npm run build      # Production build (output: dist/)
npm run watch      # Dev build with auto-reload
npm test           # Run unit tests with Vitest
npm run serve:ssr:fitbymadu-landing  # Run SSR server at http://localhost:4000/
```

Use `ng generate component <name>` to scaffold new standalone components.

## Architecture

**Angular 21 SSR landing page** with Tailwind CSS 4 and prerendering.

**Entry points:**
- `src/main.ts` — client bootstrap
- `src/main.server.ts` — server bootstrap
- `src/server.ts` — Express SSR server (port 4000 or `$PORT`)

**Routing:**
- `src/app/app.routes.ts` — client routes (currently empty)
- `src/app/app.routes.server.ts` — all routes set to `RenderMode.Prerender`

All pages are statically prerendered at build time. If dynamic routes are added, update `app.routes.server.ts` accordingly.

**Styling:**
- Tailwind CSS 4 via `@tailwindcss/postcss` (no `tailwind.config.js` needed)
- Global styles in `src/styles.css`
- Component styles use oklch color space; design token CSS variables defined in `src/app/app.css`

**TypeScript:** Strict mode enabled; use standalone components (no NgModules).
