"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { BranchId } from "@/data/branches";
import { BookingModal } from "@/components/BookingModal";
import { AcademyEnquiryModal } from "@/components/AcademyEnquiryModal";

type OpenBookingArgs = {
  branch?: BranchId;
  service?: string;
};

type OpenAcademyArgs = {
  location?: BranchId;
  courseInterest?: string;
};

type Ctx = {
  openBooking: (args?: OpenBookingArgs) => void;
  openAcademy: (args?: OpenAcademyArgs) => void;
};

const BookingCtx = createContext<Ctx | null>(null);

export function useBooking() {
  const ctx = useContext(BookingCtx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDefaults, setBookingDefaults] = useState<OpenBookingArgs>({});

  const [academyOpen, setAcademyOpen] = useState(false);
  const [academyDefaults, setAcademyDefaults] = useState<OpenAcademyArgs>({});

  const openBooking = useCallback((args?: OpenBookingArgs) => {
    setBookingDefaults(args || {});
    setBookingOpen(true);
  }, []);

  const openAcademy = useCallback((args?: OpenAcademyArgs) => {
    setAcademyDefaults(args || {});
    setAcademyOpen(true);
  }, []);

  return (
    <BookingCtx.Provider value={{ openBooking, openAcademy }}>
      {children}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        defaults={bookingDefaults}
      />
      <AcademyEnquiryModal
        open={academyOpen}
        onClose={() => setAcademyOpen(false)}
        defaults={academyDefaults}
      />
    </BookingCtx.Provider>
  );
}
