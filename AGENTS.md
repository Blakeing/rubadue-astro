# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is the **Rubadue Wire** corporate website — an Astro 5.x SSR application with React islands, Tailwind CSS, and shadcn/ui components. It serves as a product catalog, knowledge base, and lead generation site. No databases or external backend services are needed beyond the Resend email API (used for contact/quote forms).

### Prerequisites

- **Node.js 18** (per `.nvmrc`). Use `nvm use 18` or `nvm use` to activate.
- **pnpm** as the package manager (`pnpm-lock.yaml` present).

### Key commands

Standard scripts are in `package.json`:

| Task | Command |
|---|---|
| Install deps | `pnpm install` |
| Dev server | `pnpm dev` (http://localhost:4321) |
| Lint (Biome) | `pnpm lint` |
| Format (Biome) | `pnpm format` |
| Type check | `npx astro check` |
| Tests | `pnpm test:run` |
| Build | `pnpm build` (runs `astro check && astro build`) |

### Non-obvious notes

- The project uses **Biome** (not ESLint/Prettier) for linting and formatting. Config is in `biome.json`.
- There are **72 pre-existing lint errors** in the repo (as of setup). These are in the existing codebase and not caused by environment issues.
- The Astro config uses `output: "server"` with the Vercel adapter. The dev server works fine locally, but `pnpm build` produces a Vercel-specific build. Use `pnpm dev` for local development.
- `RESEND_API_KEY` env var is needed only for email-sending API routes (`/api/contact`, `/api/quote-request`). The site runs fully without it; forms just won't send emails.
- Vitest tests are under `src/lib/litz-calculations.test.ts` (51 unit tests for Litz wire calculation logic).
- Path alias `@/*` maps to `./src/*` in both `tsconfig.json` and `vitest.config.ts`.
