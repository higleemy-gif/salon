// Billing dashboard ↔ WhatsApp CRM (whatsapp-crm/) bridge.
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const prisma = require('../config/db');
const wacrm = require('../services/wacrmClient');
const billWhatsApp = require('../services/billWhatsApp');

const router = express.Router();
router.use(authenticate);

function sendError(res, e) {
  const status = e.status && e.status >= 400 && e.status < 500 ? 400 : 502;
  const code = e.code || 'error';
  res.status(['no_template', 'no_phone', 'not_configured'].includes(code) ? 400 : status)
    .json({ error: e.message, code });
}

// Connection status + automation settings for the WhatsApp page.
router.get('/status', async (_req, res, next) => {
  try {
    const s = (await prisma.settings.findFirst()) || {};
    const result = {
      configured: wacrm.isConfigured(),
      url: wacrm.publicUrl() || null,
      connected: false,
      account: null,
      scopes: [],
      error: null,
      settings: {
        waCrmAutoSendBill: Boolean(s.waCrmAutoSendBill),
        waCrmBillTemplate: s.waCrmBillTemplate || '',
        waCrmTemplateLanguage: s.waCrmTemplateLanguage || 'en',
      },
    };
    if (result.configured) {
      try {
        const me = await wacrm.me();
        result.connected = true;
        result.account = me?.account?.name || null;
        result.scopes = me?.key?.scopes || [];
      } catch (e) {
        result.error = e.message;
      }
    }
    res.json(result);
  } catch (err) { next(err); }
});

// Send one bill now (Bills page button).
router.post('/invoices/:id/send', async (req, res) => {
  try {
    const data = await billWhatsApp.sendBill(req.params.id);
    res.json({ ok: true, messageId: data?.message_id || null });
  } catch (e) { sendError(res, e); }
});

// Send a sample bill message to check the template (admin only).
router.post('/test', authorize('ADMIN'), async (req, res) => {
  const phone = String(req.body?.phone || '').trim();
  if (!wacrm.toE164(phone) || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'Enter a valid phone number' });
  }
  try {
    const data = await billWhatsApp.sendTest(phone);
    res.json({ ok: true, messageId: data?.message_id || null });
  } catch (e) { sendError(res, e); }
});

module.exports = router;
