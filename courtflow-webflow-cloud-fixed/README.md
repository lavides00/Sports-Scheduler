# CourtFlow — Webflow Cloud Sports Court Scheduler

A Next.js sports court availability and booking app designed for Webflow Cloud.

## Deploy to Webflow Cloud

1. Create a new GitHub repository.
2. Upload the **contents of this folder** to the repository root. `package.json` must be at the repository root.
3. In Webflow, open your Workspace and choose **Create app / Deploy app**.
4. Connect GitHub and select this repository.
5. Select **Next.js** and deploy.
6. If attaching to an existing Webflow site, choose a mount path such as `/scheduler`.

The project declares its SQLite/D1 binding in `wrangler.json`. Webflow Cloud provisions the real database ID during deployment; the committed `database_id: "0"` is only a required placeholder. The `migrations` folder is applied automatically by Webflow Cloud.

## Project structure

- `app/` — Next.js pages and booking API
- `lib/` — database helper
- `migrations/001_init.sql` — booking database schema
- `wrangler.json` — Webflow Cloud SQLite binding
- `package.json` — Next.js dependencies and build script

## Local development

Requires Node.js 22+.

```bash
npm install
npm run dev
```

For local database testing, use Wrangler/D1 and the `DB` binding.

## Notes

- Booking conflicts are prevented by a database unique constraint on date + court + start time.
- This is an MVP and does not yet include authentication, payments, admin roles, recurring bookings, or notifications.
