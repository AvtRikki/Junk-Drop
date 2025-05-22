# Junk‑Drop

![Next.js](https://img.shields.io/badge/Next.js-^14-brightgreen?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%93-blue?logo=typescript)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-informational)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%E2%9C%93-06B6D4?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

> **Draft README** — feel free to adjust any section: description, licensing, contacts, or deployment instructions.

---

## About the Project

**Junk‑Drop** is a modern full‑stack web application built with **Next.js 14** and TypeScript. The starter stack includes:

- App Router for file‑system routing, Server Components, and Server Actions;
- **Drizzle ORM** (PostgreSQL/SQLite) with type‑safe schema and migrations;
- **Tailwind CSS** for utility‑first styling;
- API layers via Route Handlers and middleware;
- Strict code quality checks (ESLint + Prettier);
- Zero‑config deployment to **Vercel**.

> Replace this paragraph with a brief pitch or business logic description.

---

## Tech Stack

| Layer    | Technology                                       |
| -------- | ------------------------------------------------ |
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS   |
| Backend  | Next.js App Router (API routes & Server Actions) |
| Database | Drizzle ORM + migrations (PostgreSQL / SQLite)   |
| Quality  | ESLint, Prettier, Jest / Playwright (if present) |
| DevOps   | Vercel CI, GitHub Actions (optional)             |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/AvtRikki/Junk-Drop.git && cd Junk-Drop
```

### 2. Install dependencies

```bash
npm install        # or pnpm install / yarn install
```

### 3. Configure environment variables

Copy the example file and fill in **only** the variables you need:

```bash
cp .env.example .env.local
```

```dotenv
# DATABASE_URL="postgres://user:password@localhost:5432/junk_drop"
# NEXT_PUBLIC_SITE_URL="http://localhost:3000"
# ...other variables
```

### 4. Run database migrations (optional)

```bash
npx drizzle-kit push          # create tables
# or
npm run db:migrate            # if the script exists in package.json
```

### 5. Start the dev server

```bash
npm run dev   # http://localhost:3000
```

### 6. Build & start in production mode

```bash
npm run build
npm start     # defaults to port 3000
```

## Project Structure (TL;DR)

```
.
├── app/               # App Router pages & layouts
├── components/        # Reusable React components
├── drizzle/           # SQL models, migrations, drizzle.config.ts
├── lib/               # Utilities & wrappers (db/ – Drizzle client)
├── public/            # Static assets
├── schemas/           # Zod / Drizzle validation schemas
├── middleware.ts      # Global middleware
├── tailwind.config.js # Tailwind config
└── ...
```

---

## package.json Scripts

| Script       | Purpose                            |
| ------------ | ---------------------------------- |
| `dev`        | Launch dev server with hot reload  |
| `build`      | Production build of Next.js        |
| `start`      | Start the built application        |
| `lint`       | Run ESLint                         |
| `db:migrate` | Example Drizzle migrations command |

> Check `package.json` for the actual script names.

---

## Deployment

### Vercel

Works out of the box — just connect the repo and set the environment variables.

### Docker (optional)

```dockerfile
# multi‑stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
CMD ["node", "server.js"]
```

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
