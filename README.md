# Apex Tech Era Agency

Clone of [apextechera.com](https://apextechera.com) built as a Next.js app.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build (writes the static export to `out/`)
- `npm run preview` — serve `out/` the way a host does (gzip/brotli, keep-alive, Range for video)
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run check` — lint + typecheck + build

> `next.config.ts` uses `output: "export"`, so there is no Node server and `npm run start`
> does not work. Always measure performance with `npm run build && npm run preview` —
> `next dev` ships unminified bundles and compiles on demand, which makes the site look
> several times slower than production.