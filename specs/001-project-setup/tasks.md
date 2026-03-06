# Tasks: Project Foundation Setup

**Input**: Design documents from `/specs/001-project-setup/`
**Branch**: `001-project-setup`
**Generated**: 2026-03-06

> **Note**: This is a technical setup feature with no user stories. Phases map to the
> 6 Technical Goals from spec.md. Labels use `[G1]`–`[G6]` instead of `[US1]`–`[US6]`.
> Tests are not applicable for this setup feature (nothing to unit-test; verification is
> manual or via build/dev commands per the success criteria).

## Format: `[ID] [P?] [Goal?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Gn]**: Which Technical Goal this task belongs to
- All file paths are relative to the repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize the repository baseline — Node version, Next.js scaffold, directory
structure. Must complete before any Goal work begins.

- [ ] T001 Verify Node.js 22+ is active: run `nvm use 22` (or `nvm install 22`) and confirm
      `node --version` shows 22.x
- [ ] T002 Initialize Next.js 15 app at repo root: `yarn create next-app@latest . --typescript
      --eslint --tailwind --app --no-src-dir --import-alias "@/*"` — accept all prompts
- [ ] T003 Create application directory structure:
      `mkdir -p src/components/ui src/lib/supabase src/i18n e2e`
- [ ] T004 Verify default app works: run `yarn dev`, confirm default page loads at
      http://localhost:3000, then stop the server

**Checkpoint**: Repository initialized, `yarn dev` starts.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Install all shared dependencies and configure `.gitignore` and `package.json`
scripts. MUST complete before any Goal phase begins.

**⚠️ CRITICAL**: No Goal work can begin until this phase is complete.

- [ ] T005 Add `.env.local`, `.env.test` to `.gitignore` (verify `mpmxai_styleguide.md` is
      already listed)
- [ ] T006 [P] Install runtime dependencies:
      `yarn add @fontsource/montserrat lucide-react @supabase/supabase-js @supabase/ssr`
- [ ] T007 [P] Install dev dependencies:
      `yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react
      @testing-library/jest-dom @testing-library/user-event @playwright/test dotenv`
- [ ] T008 Run `npx playwright install chromium` to install Playwright browser binary
- [ ] T009 Add scripts to `package.json`:
      `"test": "vitest"`, `"test:run": "vitest run"`, `"test:e2e": "playwright test"`

**Checkpoint**: All dependencies installed, scripts registered. `yarn install` passes.

---

## Phase 3: Goal 1 — Next.js App (P1)

**Goal**: The Next.js 15 App Router project starts and builds without errors with TypeScript
strict mode enabled.

**Independent Test**: `yarn dev` starts without errors; `yarn build` completes cleanly.

- [ ] T010 [G1] Verify `tsconfig.json` has `"strict": true` under `compilerOptions`; add it
      if missing — file: `tsconfig.json`
- [ ] T011 [G1] Replace `app/page.tsx` with a minimal placeholder (single `<main>` with
      a heading) that compiles without TypeScript errors — file: `app/page.tsx`
- [ ] T012 [G1] Run `yarn build` and confirm it exits 0 with no TypeScript errors

**Checkpoint** (SC-001, SC-002): `yarn dev` starts; `yarn build` passes cleanly.

---

## Phase 4: Goal 2 — Design System Foundation (P1)

**Goal**: Replace default `globals.css` with mpmX.ai design tokens (Tailwind v4 `@theme {}`,
`:root`/`.dark` HSL values, utility classes). Montserrat font loaded. Root layout configured.

**Independent Test**: Smoke-test page renders with dark background, Montserrat font, gradient
heading, and glass card. No default Next.js styles visible.

- [ ] T013 [G2] Replace `app/globals.css` entirely with Tailwind v4 structure per
      `quickstart.md §Step 3`: `@import "tailwindcss"`, `@theme {}` block with all mpmX.ai
      colour tokens mapped to Tailwind utilities, `:root`/`.dark` HSL values from
      `mpmxai_styleguide.md`, utility classes (`.glass`, `.glow-*`, `.text-gradient`,
      `.gradient-bg`, animations, `prefers-reduced-motion` override) — file: `app/globals.css`
- [ ] T014 [G2] Update `app/layout.tsx` per `quickstart.md §Step 4`: import Montserrat weights
      (400, 500, 600, 700), set `<html lang="en" className="dark">`, apply
      `bg-background text-foreground font-sans antialiased` to `<body>` — file: `app/layout.tsx`
- [ ] T015 [G2] Update `app/page.tsx` to smoke-test page per `quickstart.md §Step 5`: render
      `text-gradient` heading, `text-foreground` paragraph, `.glass` card with `.glow-green`
      using `bg-background` as page background — file: `app/page.tsx`
- [ ] T016 [G2] Verify visually: run `yarn dev`, confirm at http://localhost:3000 — dark
      background, Montserrat font, gradient heading, glass card with neon glow, no white
      backgrounds, no default Next.js styles

**Checkpoint** (SC-003): Design tokens render correctly — dark bg, neon accents, Montserrat
visible on test page.

---

## Phase 5: Goal 3 — shadcn/ui Component Library (P1)

**Goal**: shadcn/ui initialized with dark theme and mpmX.ai CSS variables. Base components
installed in `src/components/ui/`.

**Independent Test**: shadcn Button and Card render with correct dark theme (no white
backgrounds, mpmX.ai token colours applied).

- [ ] T017 [G3] Run `npx shadcn@latest init` — when prompted, set:
      components path: `src/components`, CSS variables: yes, base color: slate or neutral;
      after init, verify `app/globals.css` mpmX.ai tokens are intact (merge shadcn additions
      without overwriting the `@theme {}` block or `:root` values)
- [ ] T018 [P] [G3] Install shadcn components:
      `npx shadcn@latest add button input label card avatar separator`
      — files created in `src/components/ui/`
- [ ] T019 [G3] Add a shadcn `<Button>` and `<Card>` to the smoke-test page
      (`app/page.tsx`) to verify dark theme rendering — file: `app/page.tsx`
- [ ] T020 [G3] Verify at http://localhost:3000 — Button and Card use mpmX.ai token colours,
      no white backgrounds anywhere on the page

**Checkpoint**: shadcn Button and Card render with correct dark theme.

---

## Phase 6: Goal 4 — Supabase Connection (P1)

**Goal**: Two Supabase projects created. `@supabase/ssr` client helpers scaffold. `middleware.ts`
runs session refresh on every request. App boots without initialization errors.

**Independent Test**: `yarn dev` boots with `.env.local` present; no Supabase errors in
console; middleware runs on every request without throwing.

- [ ] T021 [G4] Create two Supabase projects in Supabase dashboard (manual):
      `duckx-prod` (production) and `duckx-test` (for E2E tests); copy Project URLs and keys
- [ ] T022 [G4] Create `.env.local` at repo root (gitignored) with prod project credentials
      per `quickstart.md §7b` — file: `.env.local`
- [ ] T023 [G4] Create `.env.test` at repo root (gitignored) with test project credentials
      per `quickstart.md §7b` — file: `.env.test`
- [ ] T024 [P] [G4] Create `src/lib/supabase/client.ts` with `createBrowserClient` helper
      per `quickstart.md §7c` — file: `src/lib/supabase/client.ts`
- [ ] T025 [P] [G4] Create `src/lib/supabase/server.ts` with `createServerClient` + cookies
      helper per `quickstart.md §7d` — file: `src/lib/supabase/server.ts`
- [ ] T026 [G4] Create `middleware.ts` at repo root with session refresh placeholder per
      `quickstart.md §7e` and `research.md Decision 4`; use `getUser()` not `getSession()`;
      return `supabaseResponse` — file: `middleware.ts`
- [ ] T027 [G4] Verify `yarn dev` boots without errors; confirm in browser DevTools /
      terminal that middleware runs on navigation without throwing

**Checkpoint**: Supabase client initializes; middleware runs without errors on every request.

---

## Phase 7: Goal 5 — Test Infrastructure (P2)

**Goal**: Vitest configured (0 tests, no config errors). Playwright configured and launches
against test Supabase project.

**Independent Test**: `yarn test` exits 0 (no config errors); `yarn test:e2e` launches
Playwright and exits cleanly.

- [ ] T028 [G5] Create `vitest.config.ts` per `quickstart.md §Step 8` — jsdom environment,
      globals: true, setupFiles: vitest.setup.ts, exclude e2e, `@` alias — file: `vitest.config.ts`
- [ ] T029 [G5] Create `vitest.setup.ts` importing `@testing-library/jest-dom`
      — file: `vitest.setup.ts`
- [ ] T030 [G5] Create `playwright.config.ts` per `quickstart.md §Step 9` — load `.env.test`
      via dotenv, testDir: `./e2e`, webServer: `yarn dev`, baseURL: http://localhost:3000,
      chromium only — file: `playwright.config.ts`
- [ ] T031 [G5] Add placeholder `e2e/.gitkeep` so the directory is tracked — file: `e2e/.gitkeep`
- [ ] T032 [G5] Verify `yarn test` exits 0 with message "no test files found"
- [ ] T033 [G5] Verify `yarn test:e2e` launches Playwright and exits cleanly (no tests,
      no config errors)

**Checkpoint** (SC-004, SC-005): `yarn test` exits 0; `yarn test:e2e` exits 0.

---

## Phase 8: Goal 6 — Vercel Deployment (P2)

**Goal**: GitHub repository connected to Vercel. Production environment variables configured.
Push to `main` triggers a passing deployment.

**Independent Test**: Vercel deployment build passes; app loads at the Vercel preview URL.

- [ ] T034 [G6] Connect GitHub repository to Vercel (manual): vercel.com → New Project →
      Import repository → configure project name
- [ ] T035 [G6] Add production environment variables in Vercel dashboard (Settings →
      Environment Variables): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY` (mark sensitive) — for Production environment
- [ ] T036 [G6] Merge `001-project-setup` branch to `main` (PR or direct merge) and confirm
      Vercel deployment is triggered
- [ ] T037 [G6] Verify deployment passes in Vercel dashboard; open preview URL and confirm
      smoke-test page renders correctly with dark theme

**Checkpoint** (SC-006): Vercel deployment passes; app served at preview URL.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all goals before the branch is considered done.

- [ ] T038 Run `yarn build` once more on the final codebase and confirm it exits 0 with no
      TypeScript errors (SC-002)
- [ ] T039 [P] Confirm `.env.local` is not staged: `git status` — must not appear in tracked
      files (SC-007)
- [ ] T040 [P] Confirm `.env.test` is not staged: `git status` — must not appear in tracked
      files (SC-007)
- [ ] T041 Go through the verification checklist in `specs/001-project-setup/quickstart.md`
      and tick off each item
- [ ] T042 Commit all implementation files with message:
      `feat: initialize project foundation (Next.js 15, Tailwind v4, shadcn/ui, Supabase, Vitest, Playwright)`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all Goal phases
- **Phase 3 (G1)**: Depends on Phase 2
- **Phase 4 (G2)**: Depends on Phase 3 (needs the app to be running)
- **Phase 5 (G3)**: Depends on Phase 4 (shadcn merges into globals.css)
- **Phase 6 (G4)**: Depends on Phase 2 (dependencies installed); can run parallel to G2/G3
- **Phase 7 (G5)**: Depends on Phase 2 (dependencies installed); can run parallel to G3/G4
- **Phase 8 (G6)**: Depends on all P1 goals (G1–G4) being complete; G5 recommended but not blocking
- **Phase 9 (Polish)**: Depends on all phases complete

### Goal Dependencies

```
Phase 1 → Phase 2 → G1 → G2 → G3 ─┐
                  ↘ G4 (parallel)  ├─→ Phase 8 (G6) → Phase 9
                  ↘ G5 (parallel) ─┘
```

### Parallel Opportunities

| Parallel Group | Tasks | When |
|---|---|---|
| Dependency install | T006, T007 | Phase 2 |
| Supabase client files | T024, T025 | Phase 6 |
| shadcn component install | T018 | Phase 5 (while testing T017) |
| Secret verification | T039, T040 | Phase 9 |
| **G4 + G5** | Phase 6 + Phase 7 | Can proceed in parallel after Phase 2 |

---

## Parallel Execution Example: Goals 4 & 5

Once Phase 3 (G1) is complete and `.env.local` / `.env.test` exist, Goals 4 and 5
can proceed in parallel:

```text
Thread A — Goal 4 (Supabase):
  T021 Create Supabase projects (manual)
  T022 Create .env.local
  T023 Create .env.test
  T024 + T025 in parallel: client.ts + server.ts
  T026 Create middleware.ts
  T027 Verify

Thread B — Goal 5 (Test Infrastructure):
  T028 Create vitest.config.ts
  T029 Create vitest.setup.ts
  T030 Create playwright.config.ts
  T031 Create e2e/.gitkeep
  T032 + T033 Verify
```

---

## Implementation Strategy

### MVP (Goals 1–4, P1 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: Goal 1 — Next.js App
4. Complete Phase 4: Goal 2 — Design System
5. Complete Phase 5: Goal 3 — shadcn/ui
6. Complete Phase 6: Goal 4 — Supabase
7. **STOP and VALIDATE**: smoke-test page renders; Supabase client initializes; `yarn build` passes
8. This is the minimum foundation all feature branches require

### Full Setup (Goals 1–6)

Continue with:
- Phase 7: Goal 5 — Test Infrastructure
- Phase 8: Goal 6 — Vercel Deployment
- Phase 9: Polish

### Success Criteria Summary

| Criterion | Verified by |
|---|---|
| SC-001: `yarn dev` starts | T004, T012, T027 |
| SC-002: `yarn build` passes | T012, T038 |
| SC-003: Design tokens render | T016, T020 |
| SC-004: `yarn test` exits 0 | T032 |
| SC-005: `yarn test:e2e` exits 0 | T033 |
| SC-006: Vercel deployment passes | T037 |
| SC-007: No secrets in git | T039, T040 |

---

## Notes

- T021, T034 are manual steps (browser/dashboard) — cannot be automated
- shadcn init (T017) modifies `globals.css`; always re-check mpmX.ai tokens are intact after
- `@` alias in `vitest.config.ts` maps to repo root (not `src/`), matching Next.js convention
- Playwright only installs chromium for local dev; CI can add firefox/webkit as needed
- After T036 (merge to main), the `001-project-setup` branch work is complete
