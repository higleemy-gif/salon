"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useBooking } from "@/components/BookingProvider";
import type { BranchId } from "@/data/branches";

/* -------- Reveal on scroll -------- */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------- Eyebrow / section header -------- */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  invert = false
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  invert?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2
        className={`heading-serif mt-3 text-3xl sm:text-4xl md:text-5xl ${
          invert ? "text-ink" : "text-gold-light"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed ${
            invert ? "text-muted" : "text-gold-pale/75"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-px w-24 ${align === "center" ? "mx-auto" : ""}`}
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />
    </div>
  );
}

/* -------- Book Appointment button (opens modal) -------- */
export function BookButton({
  className,
  variant = "primary",
  label = "Book Appointment",
  branch,
  service
}: {
  className?: string;
  variant?: "primary" | "outline";
  label?: string;
  branch?: BranchId;
  service?: string;
}) {
  const { openBooking } = useBooking();
  return (
    <button
      onClick={() => openBooking({ branch, service })}
      className={`${variant === "primary" ? "btn-primary" : "btn-outline"} ${className || ""}`}
    >
      {label}
    </button>
  );
}

/* -------- Enrol button (opens academy modal) -------- */
export function EnrolButton({
  className,
  variant = "primary",
  label = "Enrol / Enquire on WhatsApp",
  location
}: {
  className?: string;
  variant?: "primary" | "outline";
  label?: string;
  location?: BranchId;
}) {
  const { openAcademy } = useBooking();
  return (
    <button
      onClick={() => openAcademy({ location })}
      className={`${variant === "primary" ? "btn-primary" : "btn-outline"} ${className || ""}`}
    >
      {label}
    </button>
  );
}
