# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm install` — install dependencies (pnpm is the required package manager; the deploy workflow uses `npm ci` but local dev should use pnpm)
- `pnpm run dev` — start Vite dev server
- `pnpm run build` — type-check (`tsc -b`) and build static site to `dist/`
- `pnpm run preview` — preview the production build locally
- `pnpm test` — run Vitest test suite (e.g. `src/lib/date.test.ts`)
- `pnpm run deploy` — publish `dist/` to GitHub Pages via `gh-pages`

There is no separate lint script in `package.json`; run `eslint .` directly if needed.

## Architecture

This is a single-page React + TypeScript (Vite) app with no backend. It renders a static 4-week office rotation schedule read from a JSON config file.

- **Config-driven**: rotation schedules live as JSON files under `config/` (e.g. `rotation-2-seats.json`, `rotation-2-seats-with-erick-dev.json`). Each file matches the `RotationConfig` type (`src/lib/types.ts`): `timezone`, `anchorDate`, `user`, `weekdays`, and a `schedule` array of exactly 4 week objects (`{ week, days: Record<weekday, assignment> }`).
- **Active config is a hardcoded import**: `src/App.tsx` imports one specific config file directly (currently `rotation-2-seats-with-erick-dev.json`). To switch which rotation is displayed, change that import path — there is no runtime config selection.
- **Rotation math** (`src/lib/date.ts`): `getWeekIndexFromAnchor` computes which of the 4 schedule weeks (0-3) applies to a given date, based on calendar weeks elapsed since `anchorDate` (ISO string, week starts Monday), wrapped mod 4. `getCurrentAndNextWeekIndices` derives current/next indices from that. This is the one part of the codebase with dedicated unit tests (`src/lib/date.test.ts`).
- **`src/App.tsx`** is the entire UI: computes the member list from the active config's schedule cells, lets the user pick a member to highlight, renders the 4-week table with current/next week highlighting, and handles light/dark theme (persisted to `localStorage`, respects `prefers-color-scheme`).
- **`base: '/weekly-roster-v2/'`** in `vite.config.ts` is the GitHub Pages base path — keep in sync with the actual repo name when deploying.
- **Deployment**: `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main` (no PR checks currently run in CI).

## Conventions (from `.cursorrules`)

- Arrow function declarations only (no `function` keyword)
- No code comments; prefer self-documenting names
- Type declarations belong in separate `types.ts` files, not inline in implementation files
- `.tsx` for components; keep the UI client-only, no network calls after load
- Timezone handling must respect the IANA value from the active config
