import { invoicePdfBlob, invoiceFileName } from './invoicePdf';
import { normalizePhone, formatMoney } from './format';

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function openWhatsApp(phone, message) {
  const digits = normalizePhone(phone);
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  window.open(`${base}?text=${encodeURIComponent(message)}`, '_blank');
}

export function billMessage(invoice, salon = {}) {
  const name = invoice.customer?.name || 'there';
  const total = formatMoney(invoice.totalAmount ?? 0, salon.currency || 'INR');
  const salonName = salon.salonName || 'our salon';
  return `Hi ${name}, thank you for visiting ${salonName}! ` +
    `Here is your bill ${invoice.invoiceNumber || ''} for ${total}. ` +
    `We've attached the invoice. See you again soon!`;
}

/**
 * Generate the invoice PDF and deliver it to the customer.
 * - On devices that support sharing files (most phones/tablets), opens the native
 *   share sheet so the owner can pick WhatsApp and send the actual PDF file.
 * - Otherwise downloads the PDF and opens a WhatsApp chat with a prefilled message
 *   so the owner can attach the just-downloaded file.
 *
 * Returns one of: 'shared' | 'cancelled' | 'downloaded+whatsapp' | 'downloaded'
 */
export async function sendBillToCustomer(invoice, salon, template) {
  const blob = invoicePdfBlob(invoice, salon, template);
  const filename = invoiceFileName(invoice);
  const message = billMessage(invoice, salon);
  const phone = invoice.customer?.phone;

  const file = new File([blob], filename, { type: 'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: filename, text: message });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
      // fall through to download fallback
    }
  }

  triggerDownload(blob, filename);
  if (phone) {
    openWhatsApp(phone, message);
    return 'downloaded+whatsapp';
  }
  return 'downloaded';
}

/** Just download the PDF (used by the Bills list "Download" action). */
export function downloadBill(invoice, salon, template) {
  triggerDownload(invoicePdfBlob(invoice, salon, template), invoiceFileName(invoice));
}

/** Open the PDF in a new tab for preview/printing. */
export function previewBill(invoice, salon, template) {
  const blob = invoicePdfBlob(invoice, salon, template);
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
