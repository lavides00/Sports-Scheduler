# CourtFlow — Webflow Cloud Sports Court Scheduler

A Next.js sports court availability and booking scheduler designed for Webflow Cloud.

## Stack
- Next.js 15
- React 19
- Webflow Cloud
- Cloudflare/OpenNext
- Webflow Cloud SQLite (D1)

## GitHub structure
The contents of this folder must be at the repository root. `package.json`, `webflow.json`, and `wrangler.json` must not be inside another nested folder.

## Deploy to Webflow Cloud
1. Push the contents of this folder to GitHub.
2. In Webflow Cloud, connect the repository and use the repository root as the app path.
3. Webflow Cloud detects Next.js from `webflow.json`/`package.json`.
4. Deploy the environment.
5. Webflow Cloud provisions the `DB` SQLite binding from `wrangler.json` and applies `migrations/001_init.sql`.

## If a deployment fails
Open **App → Deployments → failed deployment → Build logs** and inspect the first error. Do not rely on the generic “Something went wrong” message.

## Local commands
```bash
npm install
npm run dev
```

For Workers-runtime preview:
```bash
npm run preview
```

## Database
The `DB` binding is declared in `wrangler.json` with a placeholder `database_id` of `0`. Webflow Cloud replaces the placeholder with the environment's real database ID during deployment.
