import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMoneyPdf, formatDateTime } from './format';
import { normalizeTemplate } from './invoiceTemplate';

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [37, 112, 233];
}

function dataUrlFormat(dataUrl) {
  if (typeof dataUrl !== 'string') return null;
  const m = /^data:image\/(png|jpe?g|webp)/i.exec(dataUrl);
  if (!m) return null;
  return m[1].toLowerCase() === 'jpg' ? 'JPEG' : m[1].toUpperCase();
}

export function invoiceFileName(invoice) {
  return `Bill-${invoice?.invoiceNumber || 'invoice'}.pdf`;
}

/**
 * Build a jsPDF document for an invoice.
 * @param {object} invoice  invoice from the API (items[].service.name, price, quantity, subtotal, totals...)
 * @param {object} salon    salon settings (salonName, address, phone, email, gstNumber, logo, currency)
 * @param {object} template invoice template config (see invoiceTemplate.js)
 */
export function buildInvoiceDoc(invoice, salon = {}, template) {
  const t = normalizeTemplate(template);
  const currency = salon.currency || 'INR';
  const accent = hexToRgb(t.accentColor);
  const gray = [100, 116, 139];

  const doc = new jsPDF({ unit: 'pt', format: t.paperSize === 'a5' ? 'a5' : 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = 44;

  // ── Header: logo + salon name ──
  let textX = margin;
  if (t.showLogo && salon.logo) {
    const fmt = dataUrlFormat(salon.logo);
    if (fmt) {
      try { doc.addImage(salon.logo, fmt, margin, y - 8, 46, 46); textX = margin + 58; } catch { /* ignore bad logo */ }
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...accent);
  doc.text(t.headerText || salon.salonName || 'My Salon', textX, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  let infoY = y + 22;
  const infoLines = [];
  if (t.showAddress && salon.address) infoLines.push(salon.address);
  const contact = [t.showPhone && salon.phone, t.showEmail && salon.email].filter(Boolean).join('  |  ');
  if (contact) infoLines.push(contact);
  if (t.showGst && salon.gstNumber) infoLines.push(`GSTIN: ${salon.gstNumber}`);
  infoLines.forEach((line) => {
    doc.text(String(line), textX, infoY);
    infoY += 13;
  });

  // ── Invoice meta (right aligned) ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('INVOICE', pageW - margin, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text(`No: ${invoice.invoiceNumber || '-'}`, pageW - margin, y + 16, { align: 'right' });
  doc.text(formatDateTime(invoice.createdAt || new Date()), pageW - margin, y + 29, { align: 'right' });

  y = Math.max(infoY, y + 40) + 6;

  // ── Divider ──
  doc.setDrawColor(...accent);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // ── Bill To ──
  const cust = invoice.customer || {};
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('BILL TO', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(cust.name || 'Walk-in Customer', margin, y + 15);
  if (cust.phone) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...gray);
    doc.text(String(cust.phone), margin, y + 28);
  }
  y += 42;

  // ── Items table ──
  const items = invoice.items || [];
  const rows = items.map((it, i) => {
    const qty = it.quantity || 1;
    const rate = it.price || 0;
    const name = it.service?.name || it.name || `Item ${i + 1}`;
    return [name, String(qty), formatMoneyPdf(rate, currency), formatMoneyPdf(rate * qty, currency)];
  });

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Qty', 'Rate', 'Amount']],
    body: rows.length ? rows : [['No items', '', '', '']],
    theme: 'striped',
    headStyles: { fillColor: accent, textColor: 255, fontStyle: 'bold', fontSize: 10 },
    bodyStyles: { fontSize: 10, textColor: [51, 65, 85] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'center', cellWidth: 44 },
      2: { halign: 'right', cellWidth: 85 },
      3: { halign: 'right', cellWidth: 95 },
    },
    styles: { cellPadding: 6, lineColor: [226, 232, 240], lineWidth: 0.3 },
    margin: { left: margin, right: margin },
  });

  let afterY = (doc.lastAutoTable?.finalY || y) + 16;

  // ── Totals ──
  const subtotal = invoice.subtotal ?? rows.reduce((s, _r, i) => s + (items[i].price || 0) * (items[i].quantity || 1), 0);
  const total = invoice.totalAmount ?? subtotal;
  const totalsX = pageW - margin;
  const labelX = pageW - margin - 150;

  const addTotal = (label, value, opts = {}) => {
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(opts.bold ? 12 : 10);
    doc.setTextColor(...(opts.accent ? accent : opts.bold ? [30, 41, 59] : gray));
    doc.text(label, labelX, afterY);
    doc.text(value, totalsX, afterY, { align: 'right' });
    afterY += opts.bold ? 20 : 15;
  };

  addTotal('Subtotal', formatMoneyPdf(subtotal, currency));

  if (invoice.discountValue) {
    const discAmt = invoice.discountType === 'percentage'
      ? (subtotal * invoice.discountValue) / 100
      : invoice.discountValue;
    const discLabel = invoice.discountType === 'percentage' ? `Discount (${invoice.discountValue}%)` : 'Discount';
    addTotal(discLabel, `- ${formatMoneyPdf(discAmt, currency)}`);
  }
  if (invoice.couponDiscount) addTotal('Coupon', `- ${formatMoneyPdf(invoice.couponDiscount, currency)}`);
  if (invoice.voucherDiscount) addTotal('Gift voucher', `- ${formatMoneyPdf(invoice.voucherDiscount, currency)}`);
  if (invoice.walletUsed) addTotal('Wallet used', `- ${formatMoneyPdf(invoice.walletUsed, currency)}`);

  doc.setDrawColor(...accent);
  doc.setLineWidth(0.6);
  doc.line(labelX, afterY - 6, totalsX, afterY - 6);
  afterY += 4;
  addTotal('Total', formatMoneyPdf(total, currency), { bold: true, accent: true });

  afterY += 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  const payMode = invoice.paymentMode || 'CASH';
  const payStatus = invoice.paymentStatus || 'PAID';
  doc.text(`Payment: ${payMode}  (${payStatus})`, labelX, afterY, { align: 'left' });

  // ── Thank-you note + terms ──
  let noteY = afterY + 28;
  if (t.thankYouNote) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...accent);
    doc.text(doc.splitTextToSize(t.thankYouNote, pageW - margin * 2), margin, noteY);
    noteY += 14 * doc.splitTextToSize(t.thankYouNote, pageW - margin * 2).length + 6;
  }
  if (t.terms) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const termLines = doc.splitTextToSize(t.terms, pageW - margin * 2);
    doc.text(termLines, margin, noteY);
  }

  // ── Footer ──
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(t.footerText || salon.salonName || '', pageW / 2, pageH - 24, { align: 'center' });

  return doc;
}

export function invoicePdfBlob(invoice, salon, template) {
  return buildInvoiceDoc(invoice, salon, template).output('blob');
}

export function invoicePdfDataUri(invoice, salon, template) {
  return buildInvoiceDoc(invoice, salon, template).output('datauristring');
}
