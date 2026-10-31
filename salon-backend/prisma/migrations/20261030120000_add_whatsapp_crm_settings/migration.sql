-- WhatsApp CRM automation settings (additive, safe on existing data)
ALTER TABLE "settings" ADD COLUMN "waCrmAutoSendBill" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "settings" ADD COLUMN "waCrmBillTemplate" TEXT;
ALTER TABLE "settings" ADD COLUMN "waCrmTemplateLanguage" TEXT NOT NULL DEFAULT 'en';
