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
  // Connect as the superuser role to the default `postgres` db to create the target db.
  const u = new URL(appUrl);
  u.username = 'supabase_admin';
  u.pathname = '/postgres';
  return u.toString();
}

function targetDbName(appUrl) {
  return decodeURIComponent(new URL(appUrl).pathname.replace(/^\//, '')) || 'salon';
}

async function ensureDatabase() {
  if (!APP_URL) { console.error('DATABASE_URL not set'); return; }
  const dbName = targetDbName(APP_URL);
  const appUser = decodeURIComponent(new URL(APP_URL).username) || 'postgres';
  const admin = new Client({ connectionString: adminConnString(APP_URL), connectionTimeoutMillis: 15000 });
  await admin.connect();
  const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname=$1', [dbName]);
  if (exists.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${dbName}" OWNER "${appUser}"`);
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
