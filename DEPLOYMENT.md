# Deploying Orrenza for a Live Salon (Supabase + Railway + Netlify)

This guide takes the app from a cloned repo to a working site your client can use
for billing on her desktop or phone. It assumes no prior DevOps experience.

## The big picture

The app has **three parts** that get hosted in three places:

```
  Client's browser (desktop / mobile)
            │
            ▼
   Netlify  ──────────────►  Railway  ──────────────►  Supabase
  (frontend)   HTTPS API    (Express backend)  SQL    (PostgreSQL)
```

| Part | Host | Cost |
|---|---|---|
| PostgreSQL database | **Supabase** | Free tier is fine to start |
| Backend API (Express) | **Railway** | ~$5/mo, always-on (recommended for a business) |
| Frontend (React) | **Netlify** | Free |

> Why not "just Supabase"? Supabase hosts the database only. This backend must stay
> running 24/7 for a persistent WhatsApp connection and 17 scheduled jobs, so it needs
> an always-on Node host (Railway). Render's free tier also works but sleeps when idle,
> which causes a slow first request — fine for a demo, less ideal for live billing.

---

## Step 1 — Create the database on Supabase

1. Sign up at [supabase.com](https://supabase.com) and click **New project**.
2. Pick a name, set a strong **database password**, choose the region closest to the salon, and create it.
3. Go to **Project Settings → Database → Connection string**.
4. Select the **Session pooler** tab. Copy the string. It looks like:
   ```
   postgresql://postgres.<project-ref>:[PASSWORD]@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
5. Replace `[PASSWORD]` with the password from step 2. Keep this value handy — it's your `DATABASE_URL`.

> Use the **Session pooler** (port 5432) string. It is IPv4-friendly and works for both
> the running server and the database migrations below.

---

## Step 2 — Set up the backend database schema (run once, from your machine)

In a terminal on your computer:

```bash
cd salon-backend
cp .env.example .env           # then edit .env
```

Edit `salon-backend/.env` and set at least:

```
DATABASE_URL="<the Supabase session-pooler string from Step 1>"
JWT_SECRET="<a long random string, 32+ chars>"
NODE_ENV="production"
SEED_ADMIN_PASSWORD="<a strong admin password>"
```

Then create the tables and demo data:

```bash
npm install
npx prisma migrate deploy     # creates all tables in Supabase
npx prisma generate
node prisma/seed.js           # loads sample services, staff, and the owner login
```

When the seed finishes it prints the logins. The one for your client:

```
Owner: kiran@orrenza.salon / Kiran@2026
```

> This owner account is pre-verified, so she can log in immediately — no email setup needed.
> Have her change the password after first login (Settings → Change password), or edit the
> seed to use her real email/password before running it.

**Optional:** skip the demo data. If you want a clean salon with no fake customers,
run only `migrate deploy` + `generate`, then create her account yourself in Supabase or
tweak `prisma/seed.js` to seed just Settings + the owner user.

---

## Step 3 — Deploy the backend to Railway

1. Push this repo to GitHub (if it isn't already).
2. Sign up at [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → pick this repo.
3. Railway reads `railway.toml` and targets the `salon-backend` folder.
4. Open the service → **Variables** tab, and add the keys from
   `salon-backend/.env.production.example`. The essentials:
   ```
   DATABASE_URL   = <same Supabase string from Step 1>
   JWT_SECRET     = <same strong secret from Step 2>
   NODE_ENV       = production
   FRONTEND_URL   = https://<your-site>.netlify.app   (fill in after Step 4)
   PORT           = 4000
   ```
5. Under **Settings → Networking**, click **Generate Domain**. Copy the public URL,
   e.g. `https://salon-backend-production.up.railway.app`. This is your API URL.
6. Confirm it's alive: open `https://<that-url>/api/health` — you should see `{"status":"ok",...}`.

---

## Step 4 — Deploy the frontend to Netlify

1. Sign up at [netlify.com](https://netlify.com) → **Add new site → Import from GitHub** → pick this repo.
2. Netlify reads `netlify.toml` (base `salon-app`, build `npm run build`, publish `dist`). Leave those as-is.
3. Before deploying, go to **Site settings → Environment variables** and add:
   ```
   VITE_API_URL = https://<your-railway-backend-url>
   ```
   (the URL from Step 3, no trailing slash)
4. Deploy. Netlify gives you a URL like `https://your-salon.netlify.app`.
5. **Go back to Railway** and set `FRONTEND_URL` to this exact Netlify URL, then redeploy the
   backend so CORS allows the frontend.

> Vite bakes `VITE_API_URL` in at build time. If you change it later, trigger a redeploy on Netlify.

---

## Step 5 — Hand off to the client

Send her:
- The site link: `https://your-salon.netlify.app`
- Her login: `kiran@orrenza.salon` / `Kiran@2026` (ask her to change the password)

She can open it on a desktop or phone browser — the UI is responsive. For billing she'll
use the **Billing** and **Appointments** pages; the owner role has access to everything.

---

## Optional extras (not required for billing day-one)

- **WhatsApp messages (Baileys):** go to Settings → WhatsApp in the app and scan the QR code.
  Note: Railway's disk is temporary, so a redeploy drops the WhatsApp session and you must
  re-scan. To keep it connected across redeploys, attach a Railway **Volume** mounted at
  `salon-backend/whatsapp-auth`.
- **Email OTP for new sign-ups:** only needed if she'll invite staff who self-register. Add the
  `SMTP_*` variables (see `.env.production.example`). Otherwise create staff from the Staff page.
- **Custom domain:** both Netlify and Railway let you attach one (e.g. `app.hersalon.com`).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Login page loads but login hangs / network error | `VITE_API_URL` is wrong or missing on Netlify, or backend is down. Check `/api/health`. |
| "Not allowed by CORS" in the browser console | `FRONTEND_URL` on Railway must exactly match the Netlify URL; redeploy backend. |
| Migrations fail to connect | Use the **Session pooler** connection string (port 5432), and check the password in the URL. |
| Server crashes on boot | Ensure `JWT_SECRET` is 32+ chars and `DATABASE_URL` is set (production refuses weak/missing values). |

---

## Secrets reminder

Never commit real secrets. `.env`, `.env.production`, and `whatsapp-auth/` are already
git-ignored. Keep `DATABASE_URL`, `JWT_SECRET`, and passwords only in the host dashboards.
