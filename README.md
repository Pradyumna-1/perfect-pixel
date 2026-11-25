# Perfect Pixel

Website and admin backend for Perfect Pixel, a computer and photography service.

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Express 5, PostgreSQL (`pg`), Cloudinary, Resend
- Hosting: Vercel (frontend), Render (API)

## Structure

```
.
├── .github/workflows/        # CI/workflow automation
├── client/                   # Frontend app (Vite + React)
│   ├── public/               # Static files
│   └── src/
│       ├── assets/           # Bundled images
│       ├── components/       # Reusable UI components
│       ├── layouts/          # App/layout shells
│       ├── pages/            # Route-level views
│       ├── services/         # API client and external calls
│       ├── stores/           # Context providers and hooks
│       └── styles/           # Design tokens, base, app styles
├── server/                   # Backend app (Express)
│   ├── scripts/              # DB init / admin maintenance scripts
│   ├── sql/                  # SQL schema
│   └── src/
│       ├── config/           # DB/Cloudinary config
│       └── routes/           # API routes
├── docs/                     # Project documentation
└── README.md
```

## Getting started

Requires Node.js and PostgreSQL.

```bash
npm install
npm --prefix client install
npm --prefix server install
cp client/.env.example client/.env
cp server/.env.example server/.env
npm --prefix server run db:init
npm run dev
```

Fill in both env files before starting. Frontend: `http://localhost:5174`, API: `http://localhost:10000`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run client and server together |
| `npm run dev:client` | Run only frontend |
| `npm run dev:server` | Run only API |
| `npm run build` | Build frontend |
| `npm run typecheck` | Type-check frontend |
| `npm run lint` | Lint frontend |
| `npm start` | Start API (`server/src/index.js`) |
| `npm --prefix server run db:init` | Create tables and seed admin user |

## Deployment

See [docs/deployment.md](docs/deployment.md).
