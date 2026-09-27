"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ExternalLink, GraduationCap } from "lucide-react";
import type { BranchId } from "@/data/branches";
import { academyWhatsAppUrl, openInNewTab } from "@/lib/whatsapp";

type Props = {
  open: boolean;
  onClose: () => void;
  defaults?: { location?: BranchId; courseInterest?: string };
};

const BRANCHES: BranchId[] = ["Gunupur", "Rayagada"];

export function AcademyEnquiryModal({ open, onClose, defaults }: Props) {
  const [location, setLocation] = useState<BranchId>("Gunupur");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [courseInterest, setCourseInterest] = useState(
    "3-Month Professional Beauty Course"
  );
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<null | string>(null);

  useEffect(() => {
    if (open) {
      setLocation(defaults?.location || "Gunupur");
      setCourseInterest(
        defaults?.courseInterest || "3-Month Professional Beauty Course"
      );
      setErrors({});
      setSubmitted(null);
    }
  }, [open, defaults?.location, defaults?.courseInterest]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!location) e.location = "Select a location";
    if (!name.trim()) e.name = "Enter your name";
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, "")))
      e.phone = "Enter a valid 10-digit phone number";
    if (!courseInterest.trim()) e.courseInterest = "Add a course/focus";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canSubmit = location && name.trim() && phone.trim() && courseInterest.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const url = academyWhatsAppUrl({
      location,
      name: name.trim(),
      phone: phone.trim(),
      courseInterest: courseInterest.trim(),
      message
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
          aria-labelledby="academy-title"
        >
          <motion.div
            className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-gold/30 bg-charcoal shadow-gold-glow-lg"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close enquiry form"
              className="absolute right-3 top-3 rounded-full p-2 text-gold hover:bg-gold/10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 sm:p-8">
              <p className="eyebrow">The Academy</p>
              <h2
                id="academy-title"
                className="heading-serif mt-2 text-3xl sm:text-4xl text-gold-light"
              >
                Enrol / Enquire
              </h2>
              <p className="mt-2 text-sm text-gold-pale/70">
                Chat with admissions on WhatsApp — batch details, fees & schedule.
              </p>
              <div className="gold-hairline mt-5" />

              {submitted ? (
                <SubmittedState url={submitted} onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="label-field">Location</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BRANCHES.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setLocation(b)}
                          className={`rounded-md border px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] transition ${
                            location === b
                              ? "border-gold bg-gold/10 text-gold-light shadow-gold-glow"
                              : "border-gold/25 text-gold-pale/70 hover:border-gold/60"
                          }`}
                          aria-pressed={location === b}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    {errors.location && <ErrorText>{errors.location}</ErrorText>}
                  </div>

                  <div>
                    <label className="label-field" htmlFor="courseInterest">
                      Course / focus
                    </label>
                    <input
                      id="courseInterest"
                      value={courseInterest}
                      onChange={(e) => setCourseInterest(e.target.value)}
                      className="input-field"
                      placeholder="e.g. Full course, Makeup focus, Hair focus"
                    />
                    {errors.courseInterest && (
                      <ErrorText>{errors.courseInterest}</ErrorText>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label-field" htmlFor="a-name">
                        Full name
                      </label>
                      <input
                        id="a-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="Your name"
                      />
                      {errors.name && <ErrorText>{errors.name}</ErrorText>}
                    </div>
                    <div>
                      <label className="label-field" htmlFor="a-phone">
                        Phone
                      </label>
                      <input
                        id="a-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="numeric"
                        className="input-field"
                        placeholder="10-digit number"
                      />
                      {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                    </div>
                  </div>

                  <div>
                    <label className="label-field" htmlFor="a-msg">
                      Message (optional)
                    </label>
                    <textarea
                      id="a-msg"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="Tell us a bit about you and your goals…"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Enrol / Enquire on WhatsApp
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
