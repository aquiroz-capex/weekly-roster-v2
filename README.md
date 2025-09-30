## WeekRoster

Know the office week roster every Sunday.

### Overview
- **v1 (done)**: Automated Discord message every Sunday at 18:00 (America/Santiago) indicating the next week’s type in a 4-week rotation.
- **v2 (current)**: Minimal React + TypeScript UI that displays a table of the 4 week types, highlighting the current week type and softly highlighting the next week type.
- **Why**: Office attendance often follows a 4-week rotation, and some months have 5 weeks. The first week of a month isn’t always Type 1.
- **Cost**: Free-tier only. GitHub Actions for scheduling + Discord webhook for delivery, GitHub Pages for hosting. No servers.

### Architecture
- **Static config**: `config/rotation.json` contains timezone, send time, anchor date, and week labels.
- **Notifier script (v1)**: `scripts/notify-discord.mjs` computes the next week type and posts to Discord.
- **UI (v2)**: React + TypeScript single page (built with Vite) hosted on GitHub Pages; displays a 4-row table of week types with current and next highlights.
- **Scheduler**: `.github/workflows/weekly-notifier.yml` runs on Sundays; the script self-gates to send at local 18:00.
- **Secrets**: Discord webhook URL is stored in GitHub repo secrets as `DISCORD_WEBHOOK_URL`.

### How the rotation works
- Define an `anchorDate` (YYYY-MM-DD) that aligns to a known Type 1 week.
- Weeks advance in a strict 4-week cycle from the anchor; months with 5 weeks don’t reset the cycle.
- On each Sunday at 18:00 local time, the script computes the type for the next week and posts it.

### Tech Stack
- Node.js 20 (preinstalled in GitHub Actions)
- JavaScript (ESM) for notifier (v1)
- React + TypeScript + Vite for UI (v2)
- GitHub Actions (cron scheduling + Pages deploy)
- Discord Incoming Webhook

### Prerequisites
- Node 20+ (optional, only for local runs)
- A GitHub repository for this project
- A Discord server where you can create a webhook

### Setup
1) Clone and push to GitHub
   - Ensure the file `.github/workflows/weekly-notifier.yml` is on your default branch.

2) Create Discord webhook
   - Discord → Server Settings → Integrations → Webhooks → New Webhook → Copy Webhook URL.

3) Set GitHub Actions secret
   - GitHub repo → Settings → Secrets and variables → Actions → New repository secret
   - Name: `DISCORD_WEBHOOK_URL`
   - Value: paste the Discord webhook URL

4) Verify Actions are enabled
   - GitHub repo → Settings → Actions → General
   - Actions permissions: “Allow all actions and reusable workflows” (or your org’s allowed list)
   - Workflow permissions: “Read repository contents permission” is sufficient

5) (v2) Local UI prerequisites
   - Install Node 20+
   - Install pnpm (recommended) or npm
   - When the UI code is present, run `pnpm install` then `pnpm dev` to start the Vite dev server

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

### Running and Scheduling
- The workflow `.github/workflows/weekly-notifier.yml` schedules multiple runs near the window to handle DST; the script itself gates on local Sunday at the configured time.
- Once merged to the default branch with the secret set, it will send automatically on Sundays.
- The UI (v2) is a static site. It will be built (`pnpm build`) and deployed to GitHub Pages via CI once the UI code is added.

### Test the workflow now (without waiting for Sunday)
Option A: Temporary config change
- Set `config/rotation.json` → `sendTimeLocal` to your current local time (HH:MM), commit and push.
- In GitHub: Actions → “Weekly Notifier (Discord)” → “Run workflow” right before that minute.
- After testing, set it back to `18:00`.

Option B: Local run
- Export your webhook URL and run the script locally:

```bash
export DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/…'
node scripts/notify-discord.mjs
```

Note: The script enforces the time gate. For a local test, temporarily set `sendTimeLocal` to the current minute.

### Message format
The Discord message is a simple text post, for example:

```text
WeekRoster · Next week type: Type 3 (anchor 2025-09-20)
```

### Files
- `config/rotation.json`: Project configuration.
- `scripts/notify-discord.mjs`: Computes the next week type and posts to Discord.
- `.github/workflows/weekly-notifier.yml`: GitHub Actions schedule and job.
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
- Install dependencies: `pnpm install`
- Start dev server: `pnpm dev`
- Run tests: `pnpm test`
- Build static site: `pnpm build`

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


