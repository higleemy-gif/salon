-- Add owner-customizable invoice/bill PDF template (stored as JSON string)
ALTER TABLE "settings" ADD COLUMN "invoiceTemplate" TEXT;
