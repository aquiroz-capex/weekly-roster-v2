## WeekRoster

Know the office week roster every Sunday.

### Overview
- **Current**: Minimal React + TypeScript UI that displays a table of the 4 week types, highlighting the current week type and softly highlighting the next week type.
- **Why**: Office attendance often follows a 4-week rotation, and some months have 5 weeks. The first week of a month isn’t always Type 1.
- **Cost**: Free-tier only. GitHub Pages for hosting. No servers.

### Architecture
- **Static config**: `config/rotation.json` contains timezone, send time, anchor date, and week labels.
- **UI**: React + TypeScript single page (built with Vite) hosted on GitHub Pages; displays a 4-row table of week types with current and next highlights.

### How the rotation works
- Define an `anchorDate` (YYYY-MM-DD) that aligns to a known Type 1 week.
- Weeks advance in a strict 4-week cycle from the anchor; months with 5 weeks don’t reset the cycle.
- On each Sunday at 18:00 local time, the script computes the type for the next week and posts it.

### Tech Stack
- Node.js 20
- React + TypeScript + Vite for UI
- GitHub Actions (Pages deploy)

### Prerequisites
- Node 20+
- A GitHub repository for this project

### Setup
1) Clone and push to GitHub

2) Local UI prerequisites
   - Install Node 20+
   - Install npm
   - Run `npm install` then `npm run dev` to start the Vite dev server

### Configuration
Edit `config/rotation.json`:

```json
{
  "timezone": "America/Santiago",
  "sendTimeLocal": "18:00",
  "anchorDate": "2025-09-20",
  "labels": ["Type 1", "Type 2", "Type 3", "Type 4"]
}
```

- **timezone**: IANA timezone (e.g., `America/Santiago`).
- **sendTimeLocal**: Local time (HH:MM) to send the message each Sunday.
- **anchorDate**: A date known to be the start of a Type 1 week.
- **labels**: Labels for the 4 week types (order matters; index 0 is Type 1).

### Running and Building
- The UI is a static site. It will be built (`npm run build`) and can be deployed to GitHub Pages via CI.

### Deploying to GitHub Pages

1. Make sure your `vite.config.ts` is set up for GitHub Pages (set `base` to your repo name, e.g. `/weekly-roster-v2/`).
2. Build the site:
  ```sh
  npm run build
  ```
3. Deploy to GitHub Pages:
   - If using the included GitHub Actions workflow, push to `main` and the site will deploy automatically.
   - Or, to deploy manually, you can use the provided script:
     ```sh
     npm run build
     npm run deploy
     ```
   - (The `deploy` script uses `gh-pages -d dist`.)
   - Your site will be available at `https://<your-username>.github.io/<repo-name>/`

For more details, see the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html#github-pages).

### Testing
- Run unit tests: `npm test`

### UI behavior
The UI highlights the current and next week types based on `anchorDate` and a strict 4-week rotation.

### Files
- `config/rotation.json`: Project configuration.
- `.cursorrules`: Project conventions and decisions.

### v2 UI Requirements
- Display a table listing all 4 week types (rows for Type 1–4), derived from `config/rotation.json` labels.
- Compute the current week type and the next week type based on `anchorDate` and a strict 4-week rotation.
- Visually highlight the current week type row (primary emphasis).
- Softly highlight the next week type row (secondary emphasis).
- Show the configured timezone and next send time (e.g., Sunday 18:00 America/Santiago).
- Accessible, mobile-friendly markup (semantic HTML, high-contrast focus states).

### v2 UI Acceptance Criteria
- Given today’s date, the table highlights exactly one "current" row and one "next" row.
- The rotation honors the `anchorDate` and does not reset in 5-week months.
- Works without network requests (all logic client-side; reads static config).
- Renders in modern browsers without errors; passes basic ESLint and TypeScript checks.

### v2 Local Development (once UI code lands)
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm test`
- Build static site: `npm run build`

### Troubleshooting
- Nothing is sent:
  - Check Actions run logs in the GitHub “Actions” tab.
  - Ensure `DISCORD_WEBHOOK_URL` secret exists and is valid.
  - Confirm the script ran exactly at local Sunday `sendTimeLocal`.
  - Verify `config/rotation.json` has valid JSON and all fields.
- Timezone/DST mismatch:
  - The workflow triggers near the window; the script gates on IANA timezone via Intl API.
  - If your local time changed due to DST, verify `America/Santiago` is correct.
- Wrong week label:
  - Re-check the `anchorDate` alignment to Type 1.
  - Confirm labels order and that the rotation should be anchored weekly, not monthly.

### Future work
- Manual overrides for holidays.
- Optional Telegram/Slack channels.
- Observability via Grafana Cloud (page beacons and delivery status links).

### License
MIT


