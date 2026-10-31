// Sends a bill to the customer through the WhatsApp CRM as an approved
// Meta template. Business-initiated WhatsApp messages must use a template
// approved by Meta, so the template is created in the CRM first
// (CRM → Settings → Templates). Body variables, in order:
//   {{1}} customer name  {{2}} salon name  {{3}} bill number  {{4}} amount
const prisma = require('../config/db');
const wacrm = require('./wacrmClient');

const SYMBOL = { INR: 'Rs.', USD: '$', EUR: 'EUR', GBP: 'GBP', AED: 'AED' };

function formatAmount(amount, currency = 'INR') {
  const n = Number(amount) || 0;
  return `${SYMBOL[currency] || currency} ${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

async function getSettings() {
  return (await prisma.settings.findFirst()) || {};
}

function templateParams({ customerName, salonName, invoiceNumber, amount }) {
  return [customerName || 'Customer', salonName || 'our salon', invoiceNumber, amount];
}

async function sendBill(invoiceId, settings) {
  const s = settings || (await getSettings());
  if (!s.waCrmBillTemplate) {
    throw new wacrm.WacrmError('Set the bill template name on the WhatsApp page first', { code: 'no_template' });
  }
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: { select: { name: true, phone: true } } },
  });
  if (!invoice) throw new wacrm.WacrmError('Bill not found', { status: 404, code: 'not_found' });
  if (!invoice.customer?.phone) throw new wacrm.WacrmError('This customer has no phone number', { code: 'no_phone' });

  return wacrm.sendTemplate({
    to: invoice.customer.phone,
    name: invoice.customer.name,
    template: s.waCrmBillTemplate,
    language: s.waCrmTemplateLanguage || 'en',
    params: templateParams({
      customerName: invoice.customer.name,
      salonName: s.salonName,
      invoiceNumber: invoice.invoiceNumber,
      amount: formatAmount(invoice.totalAmount, s.currency),
    }),
  });
}

// Fire-and-forget hook used after a bill is saved. Never throws, so billing
// can't fail because WhatsApp is down or misconfigured.
async function autoSendBill(invoiceId) {
  try {
    if (!wacrm.isConfigured()) return;
    const s = await getSettings();
    if (!s.waCrmAutoSendBill || !s.waCrmBillTemplate) return;
    await sendBill(invoiceId, s);
    console.log(`📲 Bill ${invoiceId} sent via WhatsApp CRM`);
  } catch (e) {
    console.warn(`WhatsApp CRM auto-send failed for bill ${invoiceId}: ${e.message}`);
  }
}

async function sendTest(phone) {
  const s = await getSettings();
  if (!s.waCrmBillTemplate) {
    throw new wacrm.WacrmError('Set the bill template name first', { code: 'no_template' });
  }
  return wacrm.sendTemplate({
    to: phone,
    template: s.waCrmBillTemplate,
    language: s.waCrmTemplateLanguage || 'en',
    params: templateParams({
      customerName: 'Test',
      salonName: s.salonName,
      invoiceNumber: 'INV-TEST-0001',
      amount: formatAmount(100, s.currency),
    }),
  });
}

module.exports = { sendBill, autoSendBill, sendTest };
