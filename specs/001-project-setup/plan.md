# Implementation Plan: Project Foundation Setup

**Branch**: `001-project-setup` | **Date**: 2026-03-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-setup/spec.md`

## Summary

Initialize the complete project foundation for duckX: Next.js 15 App Router with TypeScript
strict mode, Tailwind CSS v4 design tokens from the mpmX.ai style guide, shadcn/ui component
library with dark theme, Supabase client configuration via `@supabase/ssr`, Vitest + Playwright
test infrastructure, and a Vercel deployment pipeline. No user-facing behaviour is introduced;
this setup establishes the baseline all subsequent features build on.

## Technical Context

**Language/Version**: TypeScript 5.x — strict mode
**Primary Dependencies**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui (latest),
`@supabase/ssr` (latest), `@fontsource/montserrat`, Lucide React
**Storage**: Supabase PostgreSQL — client config only (no schema in this feature)
**Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E)
**Target Platform**: Vercel (Node.js 22+, serverless functions)
**Project Type**: web-application
**Performance Goals**: N/A — setup only, no user-facing behaviour
**Constraints**: No external CDNs; Yarn as package manager; service role key server-side only;
`.env.local` and `.env.test` gitignored
**Scale/Scope**: Foundation — all subsequent features build on top of this

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Pre-Phase 0 Check

| Principle | Status | Notes |
|---|---|---|
| I. Brand & Design System | ✅ PASS | mpmX.ai tokens replace default globals.css; Montserrat via @fontsource; shadcn/ui as base |
| II. Privacy by Design | ✅ PASS | No external CDNs; Montserrat self-hosted via @fontsource; no analytics in setup |
| III. Accessibility | ✅ N/A | No user-facing UI — design tokens include `--ring` / focus variables |
| IV. Internationalisation | ✅ N/A | No user-visible strings in this setup feature |
| V. Performance & Mobile-First | ✅ N/A | No UI — glass/mobile utility classes are part of design system |
| VI. Architecture Patterns | ✅ PASS | App Router, Server Components default, no banned patterns introduced |
| VII. Security | ✅ PASS | `@supabase/ssr` used (not deprecated helper); service role key in `.env.local` only; proxy.ts scaffolded; `.env.local` gitignored |
| VIII. Testing | ✅ PASS | Vitest + Playwright configured; 0 tests is acceptable for setup (no logic to test) |

### Post-Phase 1 Re-check

| Principle | Status | Notes |
|---|---|---|
| I. Brand & Design System | ✅ PASS | Token architecture defined in research.md; `@theme {}` maps all mpmX.ai tokens in `src/app/globals.css` |
| VII. Security | ✅ PASS | Middleware pattern validated (getUser not getSession; supabaseResponse returned) |

## Complexity Tracking

| Item | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Tailwind v4 `@theme {}` instead of `tailwind.config.ts` | `create-next-app` Next.js 15 installs Tailwind v4 by default; constitution requires "latest stable" | Downgrading to v3 diverges from the Next.js 15 toolchain default and introduces manual maintenance |

**Constitution Amendment Applied (PATCH v1.5.0 → v1.5.1)**: CSS Architecture section updated
to reflect Tailwind v4's CSS-first approach. See `research.md` for full decision log.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-setup/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output (decisions + rationale)
├── quickstart.md        # Phase 1 output (developer setup guide)
└── tasks.md             # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css      # @import "tailwindcss" + @theme{} tokens + :root/.dark + utilities
│   ├── layout.tsx       # Root layout: Montserrat font import, dark class on <html>, lang="en"
│   └── page.tsx         # Smoke-test page: renders bg-background, glass, text-gradient classes
├── components/
│   └── ui/              # shadcn/ui: Button, Input, Label, Card, Avatar, Separator
└── lib/
    └── supabase/
        ├── client.ts    # createBrowserClient — Client Components only
        └── server.ts    # createServerClient — Server Components and Server Actions

proxy.ts             # Supabase session refresh placeholder (no route protection yet)

e2e/                      # Playwright E2E tests (empty for now)
vitest.config.ts          # jsdom environment, globals, RTL setup file
vitest.setup.ts           # imports @testing-library/jest-dom
playwright.config.ts      # webServer=yarn dev, loads .env.test, testDir=./e2e
.env.local                # gitignored — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
                          #              SUPABASE_SERVICE_ROLE_KEY (prod project)
.env.test                 # gitignored — NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
                          #              (test project for Playwright)
```

**Structure Decision**: Single Next.js project at repo root (App Router). `--src-dir` flag
used so `app/` is placed inside `src/app/` — the most popular Next.js layout. All application
code lives under `src/`: `src/app/`, `src/components/`, `src/lib/`, `src/i18n/`. The `@/*`
alias resolves to `./src/*`. shadcn/ui configured to use `src/components` as its components directory.

## Implementation Phases

### Phase A — Next.js App Initialization

1. Run `yarn create next-app@latest .` with the following options:
   - TypeScript: Yes
   - ESLint: Yes
   - Tailwind CSS: Yes (gets v4)
   - `src/` directory: **Yes** (`--src-dir` — places `app/` inside `src/app/`)
   - App Router: Yes
   - Import alias: `@/*` → resolves to `./src/*`
2. Verify `yarn dev` starts and the default page loads.
3. Create additional `src/` subdirectories as needed: `src/i18n`

### Phase B — Design System

1. Replace `src/app/globals.css` entirely with:
   - `@import "tailwindcss"`
   - `@theme {}` block mapping all mpmX.ai tokens to Tailwind utility classes
   - `:root` with dark-theme HSL values from `mpmxai_styleguide.md`
   - `.dark` override (identical values — dark theme is the only supported theme)
   - Utility classes: `.glass`, `.glow-green`, `.glow-blue`, `.glow-teal`, `.text-gradient`,
     `.gradient-bg`, animations, `prefers-reduced-motion` override
2. Install Montserrat: `yarn add @fontsource/montserrat`
3. Update `src/app/layout.tsx`:
   - Import Montserrat weight CSS files (400, 500, 600, 700)
   - Set `<html lang="en" className="dark">`
   - Apply `bg-background text-foreground font-sans` to `<body>`
4. Install Lucide React: `yarn add lucide-react`
5. Update `src/app/page.tsx` with a smoke-test page that uses `bg-background`, `glass`,
   `text-gradient`, and a `text-foreground` heading. Verify visually.

### Phase C — shadcn/ui

1. Run `npx shadcn@latest init` — select:
   - Components path: `src/components`
   - CSS variables: Yes
   - Dark theme base
2. Add base components: `npx shadcn@latest add button input label card avatar separator`
3. Verify shadcn Button and Card render with the mpmX.ai dark theme (no white backgrounds).

### Phase D — Supabase Connection

1. Create two Supabase projects via dashboard:
   - `duckx-prod` (production)
   - `duckx-test` (for Playwright E2E tests)
2. Install: `yarn add @supabase/supabase-js @supabase/ssr`
3. Create `.env.local` (gitignored) with prod project credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<prod>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<prod-service-role-key>
   ```
4. Create `src/lib/supabase/client.ts` (browser client).
5. Create `src/lib/supabase/server.ts` (server client using cookies).
6. Create `proxy.ts` at repo root with session refresh logic (see research.md Decision 4).
7. Verify app boots without errors and middleware runs on every request.

### Phase E — Test Infrastructure

1. Install Vitest deps: `yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
2. Create `vitest.config.ts` (see research.md Decision 6).
3. Create `vitest.setup.ts` importing `@testing-library/jest-dom`.
4. Add to `package.json` scripts: `"test": "vitest"`, `"test:run": "vitest run"`.
5. Verify `yarn test` exits 0 with 0 tests (no config errors).
6. Install Playwright: `yarn add -D @playwright/test dotenv` and run `npx playwright install`.
7. Create `.env.test` (gitignored) with test Supabase project credentials.
8. Create `playwright.config.ts` (see research.md Decision 7).
9. Create `e2e/` directory with a placeholder `.gitkeep`.
10. Add `"test:e2e": "playwright test"` to `package.json` scripts.
11. Verify `yarn test:e2e` launches Playwright without errors.

### Phase F — Vercel Deployment

1. Connect GitHub repository to Vercel via Vercel dashboard.
2. Configure production environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL` (prod)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (prod)
   - `SUPABASE_SERVICE_ROLE_KEY` (prod) — marked as sensitive
3. Push to `main` and verify the deployment passes.
