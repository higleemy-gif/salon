/**
 * Container startup bootstrap (runs before the API server):
 *  1. Ensures the target database exists (creates it, owned by the app user).
 *  2. Applies Prisma migrations.
 *  3. Seeds demo data only on a fresh database (so restarts don't duplicate rows).
 *  4. Starts the API server.
 *
 * Safe to run on every container start — each step is idempotent/guarded.
 */
const { Client } = require('pg');
const { execSync } = require('child_process');

const APP_URL = process.env.DATABASE_URL;

function adminConnString(appUrl) {
  // DB_ADMIN_URL lets you supply a superuser connection explicitly. Otherwise reuse
  // the app's own credentials against the default `postgres` database, which works
  // on a standard Postgres (e.g. Coolify) where the app user owns or can create DBs.
  if (process.env.DB_ADMIN_URL) return process.env.DB_ADMIN_URL;
  const u = new URL(appUrl);
  u.pathname = '/postgres';
  return u.toString();
}

function targetDbName(appUrl) {
  return decodeURIComponent(new URL(appUrl).pathname.replace(/^\//, '')) || 'salon';
}

async function databaseExists() {
  // Connecting straight to the target DB is the cheapest check and needs no extra
  // privileges. Postgres error 3D000 = "database does not exist".
  const c = new Client({ connectionString: APP_URL, connectionTimeoutMillis: 15000 });
  try {
    await c.connect();
    return true;
  } catch (e) {
    if (e.code === '3D000') return false;
    throw e;
  } finally {
    await c.end().catch(() => {});
  }
}

async function ensureDatabase() {
  if (!APP_URL) { console.error('DATABASE_URL not set'); return; }
  const dbName = targetDbName(APP_URL);
  if (await databaseExists()) {
    console.log(`ℹ️  Database "${dbName}" already exists`);
    return;
  }
  const appUser = decodeURIComponent(new URL(APP_URL).username) || 'postgres';
  const admin = new Client({ connectionString: adminConnString(APP_URL), connectionTimeoutMillis: 15000 });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname=$1', [dbName]);
  if (exists.rowCount === 0) {
    const ident = (s) => `"${s.replace(/"/g, '""')}"`;
    await admin.query(`CREATE DATABASE ${ident(dbName)} OWNER ${ident(appUser)}`);
    console.log(`✅ Created database "${dbName}" (owner ${appUser})`);
  } else {
    console.log(`ℹ️  Database "${dbName}" already exists`);
  }
  await admin.end();
}

async function isFreshDatabase() {
  const c = new Client({ connectionString: APP_URL, connectionTimeoutMillis: 15000 });
  await c.connect();
  let fresh = true;
  try {
    const r = await c.query('SELECT COUNT(*)::int AS n FROM users');
    fresh = r.rows[0].n === 0;
  } catch {
    fresh = true; // table not created yet
  } finally {
    await c.end();
  }
  return fresh;
}

(async () => {
  try { await ensureDatabase(); }
  catch (e) { console.error('⚠️  ensureDatabase failed:', e.message); }

  try { execSync('npx prisma migrate deploy', { stdio: 'inherit' }); }
  catch (e) { console.error('⚠️  prisma migrate deploy failed:', e.message); }

  try {
    if (await isFreshDatabase()) {
      console.log('🌱 Fresh database — seeding demo data...');
      execSync('node prisma/seed.js', { stdio: 'inherit' });
    } else {
      console.log('ℹ️  Existing data found — skipping seed.');
    }
  } catch (e) { console.error('⚠️  seed step failed:', e.message); }

  console.log('🚀 Starting API server...');
  require('./src/index.js');
})();
