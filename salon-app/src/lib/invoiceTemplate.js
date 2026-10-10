// Shared default for the owner-customizable invoice/bill PDF design.
// Stored (as JSON) in the backend Settings.invoiceTemplate column.

export const DEFAULT_INVOICE_TEMPLATE = {
  accentColor: '#2570e9',
  paperSize: 'a4',          // 'a4' | 'a5'
  headerText: '',           // blank => falls back to salon name
  showLogo: true,
  showAddress: true,
  showPhone: true,
  showEmail: true,
  showGst: true,
  showItemDiscount: true,
  thankYouNote: 'Thank you for visiting! We look forward to seeing you again.',
  terms: '',
  footerText: '',           // blank => falls back to salon name
};

// Merge a (possibly partial / stale) stored template over the defaults so new
// fields always have a value even for templates saved by older builds.
export function normalizeTemplate(stored) {
  if (!stored) return { ...DEFAULT_INVOICE_TEMPLATE };
  let obj = stored;
  if (typeof stored === 'string') {
    try { obj = JSON.parse(stored); } catch { obj = {}; }
  }
  return { ...DEFAULT_INVOICE_TEMPLATE, ...(obj || {}) };
}
