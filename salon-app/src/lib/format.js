// Formatting helpers (currency, dates, phone).

const SYMBOLS = { INR: '\u20B9', USD: '$', EUR: '\u20AC', GBP: '\u00A3', AED: 'AED ' };
// jsPDF's built-in fonts can't render some symbols (e.g. the rupee glyph),
// so PDFs use a safe ASCII prefix instead.
const PDF_PREFIX = { INR: 'Rs. ', USD: '$', EUR: 'EUR ', GBP: 'GBP ', AED: 'AED ' };

export function currencySymbol(code = 'INR') {
  return SYMBOLS[code] || `${code} `;
}

function groupNumber(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

// For on-screen display (HTML renders unicode symbols fine).
export function formatMoney(amount, code = 'INR') {
  return `${currencySymbol(code)}${groupNumber(amount)}`;
}

// For PDF output (ASCII-safe prefix).
export function formatMoneyPdf(amount, code = 'INR') {
  return `${PDF_PREFIX[code] || `${code} `}${groupNumber(amount)}`;
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

// Normalize a phone number to international digits for wa.me links.
// Defaults a bare 10-digit number to India (+91). Adjust defaultCc as needed.
export function normalizePhone(phone, defaultCc = '91') {
  if (!phone) return '';
  let digits = String(phone).replace(/[^\d]/g, '');
  if (digits.length === 10) digits = defaultCc + digits;
  if (digits.startsWith('0')) digits = defaultCc + digits.replace(/^0+/, '');
  return digits;
}
