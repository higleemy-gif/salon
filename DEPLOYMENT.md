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

Set the owner login before seeding with `SEED_OWNER_EMAIL` and `SEED_OWNER_PASSWORD`
(and `SEED_ADMIN_PASSWORD`, `SEED_STYLIST_PASSWORD`, `SEED_RECEPTIONIST_PASSWORD`).
With `NODE_ENV=production`, any of these passwords left unset is replaced by a random one.
When the seed finishes it prints the logins once, so copy them from the output (or the
container logs on Coolify).

> The owner account is pre-verified, so she can log in immediately — no email setup needed.
> Have her change the password after first login (Settings → Change password).

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
- Her login: the `SEED_OWNER_EMAIL` and password printed by the seed (ask her to change the password)

She can open it on a desktop or phone browser — the UI is responsive. For billing she'll
use the **Billing** and **Appointments** pages; the owner role has access to everything.

---

## Optional extras (not required for billing day-one)

- **WhatsApp messages (Baileys):** go to Settings → WhatsApp in the app and scan the QR code.
  The Docker image stores the session in `/data/whatsapp-auth` (`WHATSAPP_AUTH_DIR`).
  Container disks are temporary, so attach a persistent volume at that path or a redeploy
  drops the session and you must re-scan.
- **Email OTP for new sign-ups:** only needed if she'll invite staff who self-register. Add the
  `SMTP_*` variables (see `.env.production.example`). Otherwise create staff from the Staff page.
- **Custom domain:** both Netlify and Railway let you attach one (e.g. `app.hersalon.com`).

---

## Deploying on Coolify (one domain: website + dashboard + API)

| URL | Serves |
|---|---|
| `https://<domain>/` | Parlour website (`website/`, Next.js static export) |
| `https://<domain>/admin/` | Billing dashboard (`salon-app/`) |
| `https://<domain>/api/` | Backend, proxied by nginx inside the frontend container |

**Frontend (`salon-frontend` app)**: Base Directory `/`, Dockerfile `/Dockerfile.web`.
- Domain: `https://<domain>` (and `https://www.<domain>` if wanted).
- Build variable `NEXT_PUBLIC_SITE_URL` = `https://<domain>` (used for SEO, sitemap, robots.txt).
- Leave `VITE_API_URL` unset so the dashboard calls `/api` on the same domain.
- `BACKEND_URL` (runtime, optional) defaults to `http://salon-api:4000`.

**Backend (`salon-backend` app)**: set **Network Aliases** to `salon-api` so the frontend
container can reach it, and set `FRONTEND_URL` = `https://<domain>` (browsers still send an
Origin header on same-site API calls, so CORS must allow the domain).

**DNS**: an `A` record for `<domain>` (and `www`) pointing to the server IP. Coolify issues
the HTTPS certificate automatically once DNS resolves.

### Backend details

**Backend (`salon-backend` app)**, built from the root `Dockerfile`:
- Environment variables: `DATABASE_URL` (the `salon-db` internal URL), `JWT_SECRET`,
  `FRONTEND_URL` (the exact frontend URL, e.g. `https://app.example.com`, no trailing slash),
  and optionally `CORS_ORIGINS` for extra domains such as `https://www.example.com`.
- Set the `SEED_*` variables before the very first start. They are only used on an empty database.
- **Persistent Storage**: add a volume with destination `/data/whatsapp-auth`.

**Standalone dashboard (alternative)**: `salon-app/Dockerfile` still builds the dashboard on
its own (served under `/admin/`). It requires `VITE_API_URL` = the backend's public URL as a
build variable.

---

## WhatsApp CRM (`whatsapp-crm/`)

`whatsapp-crm/` is [wacrm](https://github.com/ArnasDon/wacrm) (MIT licence, kept in
`whatsapp-crm/LICENSE`): inbox, automations, broadcasts and chatbot flows on the
**official Meta WhatsApp Cloud API**. The billing dashboard's **WhatsApp** page links into
it and can send each bill to the customer automatically.

It is a separate app and needs:
1. **Supabase** (Supabase Cloud, or a Supabase service in Coolify) with the migrations in
   `whatsapp-crm/supabase/migrations` applied (`supabase db push`).
2. **A Meta WhatsApp Business account**: a Meta app (App Secret), a WhatsApp Business
   phone number, and a permanent access token. These are entered in the CRM's
   Settings → WhatsApp after it is running.
3. **Its own HTTPS address**, e.g. `https://crm.<domain>`. It cannot run under a path
   like `/admin`. Meta's webhook URL is `https://crm.<domain>/api/whatsapp/webhook`.

Coolify app: Base Directory `/whatsapp-crm`, Dockerfile build, port 3000. Variables:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (both build time),
`SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY` (64 hex chars), `META_APP_SECRET`,
`NEXT_PUBLIC_SITE_URL`, and `AUTOMATION_CRON_SECRET` if automations use Wait steps
(then add a Coolify scheduled task calling `/api/automations/cron` and `/api/flows/cron`
with header `x-cron-secret`). See `whatsapp-crm/.env.local.example` and `whatsapp-crm/docs/`.

**Connect billing → CRM**
1. In the CRM: Settings → API keys → new key with scopes `contacts:write` and `messages:send`.
2. On `salon-backend` set `WACRM_URL` (and `WACRM_PUBLIC_URL` if different) and `WACRM_API_KEY`, then redeploy.
3. In the CRM: Settings → Templates, create and get approval for a bill template whose body
   uses `{{1}}` customer name, `{{2}}` salon name, `{{3}}` bill number, `{{4}}` amount.
4. In the billing dashboard: WhatsApp → enter the template name, tick auto-send, Save, Send test.

Auto-send runs after the bill is saved and never blocks billing; failures are logged by the backend.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Login page loads but login hangs / network error | `VITE_API_URL` is wrong or missing on Netlify, or backend is down. Check `/api/health`. |
| "Not allowed by CORS" in the browser console | `FRONTEND_URL` (or `CORS_ORIGINS`) on the backend must exactly match the frontend URL, including `https://`; redeploy backend. The backend logs the blocked origin and prints the allowed list on startup. |
| Migrations fail to connect | Use the **Session pooler** connection string (port 5432), and check the password in the URL. |
| Server crashes on boot | Ensure `JWT_SECRET` is 32+ chars and `DATABASE_URL` is set (production refuses weak/missing values). |

---

## Secrets reminder

Never commit real secrets. `.env`, `.env.production`, and `whatsapp-auth/` are already
git-ignored. Keep `DATABASE_URL`, `JWT_SECRET`, and passwords only in the host dashboards.
