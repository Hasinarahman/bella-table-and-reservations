# Bella Restaurant

Single-page restaurant website (menu, specials, reservations, admin dashboard).

## Run locally
1. Install [Bun](https://bun.sh) (or Node.js 20+).
2. Download the project (GitHub sync or ZIP export from Lovable).
3. In the project folder run:
   ```
   bun install
   bun run dev
   ```
4. Open http://localhost:8080

The `.env` file already contains the Lovable Cloud connection, so the
reservation form and admin dashboard work locally against the same database.

## Admin dashboard
Scroll to **Admin**, choose "Create the admin account", confirm the email,
then sign in. The first account created becomes the admin.
