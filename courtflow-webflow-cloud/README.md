# CourtFlow — Sports Court Scheduler

A Webflow Cloud-ready Next.js app for court availability and reservations.

## Included
- Daily court availability grid
- Basketball, badminton, and volleyball courts
- Date navigation and sport filtering
- One-hour reservation modal
- Persistent reservations using Webflow Cloud SQLite/D1
- Collision protection with a unique database constraint
- Responsive mobile layout

## Deploy to Webflow Cloud
1. Push this folder to a GitHub repository.
2. In Webflow Dashboard → Workspace → Create app / Deploy app, connect the repository.
3. Select **Next.js** and deploy. Webflow Cloud supports Next.js and can deploy the app independently or alongside a Webflow site. See the official docs: https://developers.webflow.com/webflow-cloud/bring-your-own-app
4. The `wrangler.json` declares a SQLite binding named `DB`. Webflow Cloud provisions the database on deployment and applies `migrations/001_init.sql`.
5. For a subpath such as `/scheduler`, set that as the Webflow Cloud mount path. Do not hard-code a Next.js `basePath`; Webflow Cloud handles the mount path at build time.

## Local preview
Install Node.js 22+ and npm, then run:

```bash
npm install
npm run dev
```

The booking API expects the Webflow Cloud DB binding, so local UI preview is still possible, but persistent booking writes require a local D1/Wrangler setup or deployment.

## Production upgrades to consider
- Authentication and admin roles
- Customer email/SMS confirmations
- Payment/deposit collection
- Recurring bookings
- Court maintenance blocks
- Pricing by sport/time
- Calendar export
- Audit log
