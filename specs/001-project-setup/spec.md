# Technical Specification: Project Foundation Setup

**Feature Branch**: `001-project-setup`
**Created**: 2026-03-06
**Status**: Draft
**Type**: Technical setup — no user-facing behaviour. Skips user story format.

## Purpose

Establish the complete project foundation so that all subsequent feature branches
can start from a working, correctly configured baseline. This setup must be merged
to `main` before any feature work begins.

## Technical Goals

### Goal 1 — Next.js Application (P1, blocks everything)

Initialize the Next.js 15 project at the repository root with TypeScript strict mode
and App Router. The app must start, build, and deploy without errors.

**Verified when**: `yarn dev` starts without errors; `yarn build` completes cleanly.

### Goal 2 — Design System Foundation (P1, blocks all UI work)

Replace the Next.js default `globals.css` with the mpmX.ai design tokens (CSS custom
properties, utility classes: glass, glow, gradient, animations) from `mpmxai_styleguide.md`.
Configure `tailwind.config.ts` to map tokens to Tailwind utility classes. Install
Montserrat via `@fontsource/montserrat` and Lucide React.

**Verified when**: A test page renders using `bg-background`, `text-foreground`, `glass`,
and `text-gradient` classes correctly with no visible default Next.js styles.

### Goal 3 — shadcn/ui Component Library (P1, blocks all UI work)

Initialize shadcn/ui. Install the base components needed for the first feature:
`Button`, `Input`, `Label`, `Card`, `Avatar`, `Separator`.

**Verified when**: A test page renders a shadcn `Button` and `Card` with the mpmX.ai
dark theme applied correctly (no white backgrounds, correct token colours).

### Goal 4 — Supabase Connection (P1, blocks auth feature)

Create two Supabase projects: one for production, one for testing. Install
`@supabase/ssr` and `@supabase/supabase-js`. Configure environment variables
in `.env.local`. Scaffold the Next.js `middleware.ts` with Supabase session
refresh logic (placeholder — no route protection yet).

**Verified when**: The app boots and the Supabase client initializes without errors.
`middleware.ts` runs on every request without throwing.

### Goal 5 — Test Infrastructure (P2)

Configure Vitest with React Testing Library for unit and component tests.
Configure Playwright for E2E tests pointing to the test Supabase project.
Add `yarn test` and `yarn test:e2e` scripts.

**Verified when**: `yarn test` runs successfully (0 tests, no config errors);
`yarn test:e2e` launches Playwright without errors.

### Goal 6 — Vercel Deployment (P2)

Connect the GitHub repository to Vercel. Configure production and preview environment
variables (Supabase URL, anon key). Confirm a successful deployment of the bare app.

**Verified when**: A push to `main` triggers a Vercel deployment that passes build
and serves the app at the Vercel preview URL.

## Requirements

### Technical Requirements

- **TR-001**: Project MUST use Yarn as the package manager — `npm` scripts MUST NOT be used
- **TR-002**: Project MUST use Next.js 15 App Router with TypeScript strict mode
- **TR-003**: `app/globals.css` MUST contain all mpmX.ai design tokens and utility classes;
  Next.js default styles MUST be removed entirely
- **TR-004**: CSS custom property → Tailwind utility mapping MUST use the `@theme {}` block
  in `app/globals.css` (Tailwind v4 CSS-first); `tailwind.config.ts` MUST NOT be created
- **TR-005**: Montserrat MUST be loaded via `@fontsource/montserrat` — no external CDN
- **TR-006**: shadcn/ui MUST be initialized with the dark theme and mpmX.ai CSS variables
- **TR-007**: Two Supabase projects MUST exist: `duckx-prod` and `duckx-test`
- **TR-008**: `@supabase/ssr` MUST be used — `@supabase/auth-helpers-nextjs` MUST NOT
  be installed
- **TR-009**: `SUPABASE_SERVICE_ROLE_KEY` MUST exist in `.env.local` only — never
  committed to git, never prefixed `NEXT_PUBLIC_`
- **TR-010**: `.env.local` MUST be listed in `.gitignore`
- **TR-011**: Vitest MUST be configured with React Testing Library and jsdom environment
- **TR-012**: Playwright MUST be configured to run against the test Supabase project
- **TR-013**: `middleware.ts` MUST exist at the repo root with Supabase session handling

## Success Criteria

- **SC-001**: `yarn dev` starts without errors and the app loads in the browser
- **SC-002**: `yarn build` completes without TypeScript errors or build failures
- **SC-003**: Design tokens render correctly — dark background, neon accents, Montserrat
  font visible on a test page
- **SC-004**: `yarn test` exits with code 0 (no config errors)
- **SC-005**: `yarn test:e2e` launches Playwright without errors
- **SC-006**: A Vercel deployment succeeds on push to `main`
- **SC-007**: No secrets committed to git — `.env.local` absent from repository history

## Assumptions

- Supabase account exists (authenticated via GitHub)
- Vercel account exists (authenticated via GitHub)
- Node.js 22+ is installed locally (via nvm: `nvm install 22 && nvm use 22`)
