"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import type { BranchId } from "@/data/branches";
import { branchWhatsAppUrl, openInNewTab } from "@/lib/whatsapp";

const BRANCHES: BranchId[] = ["Gunupur", "Rayagada"];

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const choose = (b: BranchId) => {
    setOpen(false);
    openInNewTab(branchWhatsAppUrl(b));
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-64 rounded-2xl border border-gold/30 bg-charcoal/95 backdrop-blur-md shadow-gold-glow-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="eyebrow">Chat on WhatsApp</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-gold-pale/70 hover:text-gold"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gold-pale/70 mb-3">
              Which branch would you like to reach?
            </p>
            <div className="grid gap-2">
              {BRANCHES.map((b) => (
                <button
                  key={b}
                  onClick={() => choose(b)}
                  className="w-full rounded-md border border-gold/30 px-3 py-2.5 text-left text-sm text-gold-light hover:border-gold hover:bg-gold/10 transition"
                >
                  <span className="font-medium">{b}</span>
                  <span className="ml-1 text-xs text-gold-pale/60">branch</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-gold-glow-lg ring-2 ring-gold/50 hover:scale-105 transition-transform"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-25" />
      </button>
    </div>
  );
}
