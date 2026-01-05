
# WeekRoster v2

Know the office week rotation at a glance—now with a modernized UI and flexible config.

## Overview

- **UI**: React + TypeScript (Vite) single-page app, showing a table of the current 4-week rotation schedule, with clear highlights for the current and next week.
- **Config**: Rotation logic and schedules are defined in JSON files under `config/` (e.g., `rotation-2-seats.json`).
- **Hosting**: Static site, deployable to GitHub Pages. No backend or server required.

## How the rotation works

- Each config file (e.g., `rotation-2-seats.json`) defines an `anchorDate`, timezone, and a 4-week repeating schedule.
- The UI computes the current and next week based on today’s date and the anchor, cycling through the 4-week pattern regardless of month boundaries.
- Schedules can specify custom day assignments for each week.

## Tech Stack

- Node.js 20+
- React + TypeScript + Vite
- Tailwind CSS for styling
- GitHub Actions for CI/CD (Pages deploy)

## Prerequisites

- Node 20+
- npm
- A GitHub repository for this project

## Setup

1. Clone this repo and push to your GitHub account.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the local dev server:
   ```sh
   npm run dev
   ```

## Configuration

Edit or add a config file in `config/`, for example `rotation-2-seats.json`:

```json
{
  "timezone": "America/Santiago",
  "user": "Agustín",
  "sendTimeLocal": "18:00",
  "anchorDate": "2025-09-29",
  "weekdays": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
  "schedule": [
    { "week": 1, "days": { ... } },
    { "week": 2, "days": { ... } },
    { "week": 3, "days": { ... } },
    { "week": 4, "days": { ... } }
  ]
}
```

- **timezone**: IANA timezone (e.g., `America/Santiago`)
- **user**: (optional) Name of the user or owner
- **sendTimeLocal**: Local time (HH:MM) for notifications (if used)
- **anchorDate**: Date (YYYY-MM-DD) that starts week 1
- **weekdays**: Days of the week to display
- **schedule**: Array of 4 week objects, each mapping days to assignments

## Running and Building

- Start dev server: `npm run dev`
- Run tests: `npm test`
- Build static site: `npm run build`

## Deploying to GitHub Pages

1. Ensure `vite.config.ts` sets `base` to your repo name (e.g., `/weekly-roster-v2/`).
2. Build the site:
   ```sh
   npm run build
   ```
3. Deploy:
   - If using GitHub Actions, push to `main` and deployment is automatic.
   - Or, run:
     ```sh
     npm run deploy
     ```
   - (Uses `gh-pages -d dist`.)
   - Your site will be at `https://<your-username>.github.io/<repo-name>/`

See the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html#github-pages) for more.

## UI behavior

- Displays a table for the 4-week rotation, with each week as a row and days as columns.
- Highlights the current week (primary) and next week (secondary) based on today’s date and the anchor.
- Shows timezone and next send time.
- Fully client-side; no network requests after load.
- Accessible and mobile-friendly (semantic HTML, high-contrast, responsive).

## Files

- `config/rotation-2-seats.json` (or similar): Main rotation config.
- `src/`: React app source code.
- `.cursorrules`: Project conventions and decisions.

## Troubleshooting

- If the UI does not update as expected, check your config file for valid JSON and correct field names.
- For deployment issues, verify the `base` path in `vite.config.ts` and that your GitHub Pages settings are correct.

## Future work

- Manual overrides for holidays
- Optional notifications (Discord, Telegram, Slack)
- Improved observability and status reporting

## License

MIT


