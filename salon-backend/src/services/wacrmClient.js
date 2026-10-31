// Client for the WhatsApp CRM (whatsapp-crm/, "wacrm") public REST API (/api/v1).
// Docs: whatsapp-crm/docs/public-api.md
//
// Configured with env vars (secrets stay out of the database):
//   WACRM_URL      Base URL the backend uses to reach the CRM, e.g. https://crm.example.com
//                  (or an internal URL such as http://whatsapp-crm:3000 on the Coolify network)
//   WACRM_PUBLIC_URL  Optional URL shown in the dashboard's "Open CRM" links (defaults to WACRM_URL)
//   WACRM_API_KEY  API key from the CRM: Settings → API keys. Scopes needed:
//                  contacts:write, messages:send
const TIMEOUT_MS = 15000;

function baseUrl() {
  return (process.env.WACRM_URL || '').replace(/\/+$/, '');
}

function publicUrl() {
  return (process.env.WACRM_PUBLIC_URL || process.env.WACRM_URL || '').replace(/\/+$/, '');
}

function isConfigured() {
  return Boolean(baseUrl() && process.env.WACRM_API_KEY);
}

class WacrmError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function call(method, path, body) {
  if (!isConfigured()) {
    throw new WacrmError('WhatsApp CRM is not configured (set WACRM_URL and WACRM_API_KEY)', { code: 'not_configured' });
  }
  let res;
  try {
    res = await fetch(`${baseUrl()}/api/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.WACRM_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    throw new WacrmError(`Could not reach WhatsApp CRM: ${e.message}`, { code: 'unreachable' });
  }
  let json = null;
  try { json = await res.json(); } catch { /* non-JSON body */ }
  if (!res.ok) {
    const err = json?.error || {};
    throw new WacrmError(err.message || `WhatsApp CRM request failed (${res.status})`, { status: res.status, code: err.code });
  }
  return json?.data;
}

// The CRM requires E.164 ("+<country><number>"). Bare 10-digit numbers are
// treated as Indian mobiles, matching the rest of this app.
function toE164(phone) {
  if (!phone) return null;
  const trimmed = String(phone).trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return null;
  if (trimmed.startsWith('+')) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`;
  return `+${digits}`;
}

module.exports = {
  isConfigured,
  publicUrl,
  toE164,
  WacrmError,
  me: () => call('GET', '/me'),
  upsertContact: ({ phone, name }) => call('POST', '/contacts', { phone: toE164(phone), name }),
  sendText: ({ to, name, text }) => call('POST', '/messages', { to: toE164(to), name, type: 'text', text }),
  sendTemplate: ({ to, name, template, language, params }) =>
    call('POST', '/messages', { to: toE164(to), name, type: 'template', template: { name: template, language, params } }),
};
