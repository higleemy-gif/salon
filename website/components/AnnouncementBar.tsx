"use client";

import { useState } from "react";
import { ArrowRight, GraduationCap, X } from "lucide-react";
import { useBooking } from "@/components/BookingProvider";

/**
 * Slim site-wide bar promoting the academy. Sits above the sticky header.
 * Clicking anywhere on the message opens the academy enquiry modal.
 * Dismissible for the session only (small close on the right).
 */
export function AnnouncementBar() {
  const { openAcademy } = useBooking();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Academy admissions announcement"
      className="fixed top-0 inset-x-0 z-[55] w-full text-black"
      style={{ backgroundImage: "var(--gradient-gold)" }}
    >
      <div className="container-wide flex items-center gap-2 py-2 sm:py-2.5">
        <button
          onClick={() => openAcademy()}
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.18em] hover:opacity-90 transition"
        >
          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline shrink-0 font-semibold rounded-full bg-black/90 text-gold-light px-2 py-0.5 text-[10px] tracking-[0.22em]">
            Now Enrolling
          </span>
          <span className="min-w-0 truncate">
            <span className="sm:hidden">3-Month Beauty Course</span>
            <span className="hidden sm:inline">
              3-Month Professional Beauty Course
              <span className="hidden md:inline"> · Skin + Hair + Makeup</span>
              <span className="hidden lg:inline"> · Certificate on Completion</span>
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 font-semibold whitespace-nowrap">
            <span className="hidden sm:inline">Enrol Now</span>
            <span className="sm:hidden">Enrol</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="shrink-0 rounded-full p-1 hover:bg-black/10 transition"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Bottom hairline in deeper gold */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/25" />
    </div>
  );
}
