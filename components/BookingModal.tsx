"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ExternalLink } from "lucide-react";
import type { BranchId } from "@/data/branches";
import { MultiServicePicker } from "@/components/MultiServicePicker";
import { DateQuickPicker, TimeQuickPicker } from "@/components/DateTimePickers";
import { openInNewTab, salonWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  open: boolean;
  onClose: () => void;
  defaults?: { branch?: BranchId; service?: string };
};

const BRANCHES: BranchId[] = ["Gunupur", "Rayagada"];

export function BookingModal({ open, onClose, defaults }: Props) {
  const [branch, setBranch] = useState<BranchId>("Gunupur");
  const [services, setServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState<null | string>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill on open
  useEffect(() => {
    if (open) {
      setBranch(defaults?.branch || "Gunupur");
      // If a service is pre-filled (e.g. from a service tile), start with it
      // already in the multi-select; the user can add more.
      setServices(defaults?.service ? [defaults.service] : []);
      setSubmitted(null);
      setErrors({});
    }
  }, [open, defaults?.branch, defaults?.service]);

  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!branch) e.branch = "Select a branch";
    if (services.length === 0) e.services = "Pick at least one service";
    if (!name.trim()) e.name = "Enter your name";
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, "")))
      e.phone = "Enter a valid 10-digit phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canSubmit =
    branch && services.length > 0 && name.trim() && phone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const url = salonWhatsAppUrl({
      branch,
      services,
      name: name.trim(),
      phone: phone.trim(),
      date,
      time,
      notes
    });
    openInNewTab(url);
    setSubmitted(url);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black-pure/80 backdrop-blur-sm p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-modal
          role="dialog"
          aria-labelledby="booking-title"
        >
          <motion.div
            className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-gold/30 bg-charcoal shadow-gold-glow-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close booking form"
              className="absolute right-3 top-3 rounded-full p-2 text-gold hover:bg-gold/10 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              <p className="eyebrow">Book Appointment</p>
              <h2
                id="booking-title"
                className="heading-serif mt-2 text-3xl sm:text-4xl text-gold-light"
              >
                Reserve Your Slot
              </h2>
              <p className="mt-2 text-sm text-gold-pale/70">
                Pick one or more services and we&rsquo;ll confirm on WhatsApp.
              </p>
              <div className="gold-hairline mt-5" />

              {submitted ? (
                <SubmittedState url={submitted} onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Branch */}
                  <div>
                    <label className="label-field">Branch</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BRANCHES.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBranch(b)}
                          className={`rounded-md border px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] transition ${
                            branch === b
                              ? "border-gold bg-gold/10 text-gold-light shadow-gold-glow"
                              : "border-gold/25 text-gold-pale/70 hover:border-gold/60"
                          }`}
                          aria-pressed={branch === b}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    {errors.branch && <ErrorText>{errors.branch}</ErrorText>}
                  </div>

                  {/* Services — multi-select */}
                  <MultiServicePicker
                    value={services}
                    onChange={setServices}
                    error={errors.services}
                  />

                  {/* Name + Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-field" htmlFor="name">
                        Full name
                      </label>
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="Your name"
                      />
                      {errors.name && <ErrorText>{errors.name}</ErrorText>}
                    </div>
                    <div>
                      <label className="label-field" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="numeric"
                        className="input-field"
                        placeholder="10-digit number"
                      />
                      {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                    </div>
                  </div>

                  {/* Date + Time — quick pickers */}
                  <DateQuickPicker value={date} onChange={setDate} />
                  <TimeQuickPicker value={time} onChange={setTime} />

                  {/* Notes */}
                  <div>
                    <label className="label-field" htmlFor="notes">
                      Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Anything we should know…"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Confirm on WhatsApp
                    {services.length > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center rounded-full bg-black/25 text-[10px] font-bold px-1.5 py-0.5">
                        {services.length}
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-400">{children}</p>;
}

function SubmittedState({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="mt-8 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 border border-gold/40">
        <MessageCircle className="h-6 w-6 text-gold" />
      </div>
      <h3 className="heading-serif text-2xl text-gold-light">Opening WhatsApp…</h3>
      <p className="mt-2 text-sm text-gold-pale/70">
        If it didn&rsquo;t open automatically, tap the link below.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline mt-5"
      >
        <ExternalLink className="h-4 w-4" />
        Open WhatsApp
      </a>
      <button
        onClick={onClose}
        className="mt-3 block w-full text-xs uppercase tracking-[0.2em] text-gold-pale/60 hover:text-gold"
      >
        Close
      </button>
    </div>
  );
}
