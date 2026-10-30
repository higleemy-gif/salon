"use client";

import { useEffect } from "react";
import { useBooking } from "@/components/BookingProvider";
import { BookButton } from "@/components/ui";

export function BookOpenBanner() {
  const { openBooking } = useBooking();

  // Auto-open the booking modal when landing on /book
  useEffect(() => {
    const t = setTimeout(() => openBooking(), 200);
    return () => clearTimeout(t);
  }, [openBooking]);

  return (
    <section className="bg-black-pure">
      <div className="container-narrow py-16 text-center">
        <p className="text-gold-pale/75">
          Your booking form should open automatically. If it didn&rsquo;t, tap below.
        </p>
        <div className="mt-6">
          <BookButton />
        </div>
      </div>
    </section>
  );
}
