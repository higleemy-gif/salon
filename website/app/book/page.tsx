import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { BookOpenBanner } from "@/components/BookOpenBanner";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Book your appointment at MIRRORS Unisex Salon & Academy — Gunupur or Rayagada. Confirmation on WhatsApp."
};

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Book"
        title="Reserve Your Chair"
        subtitle="Fill in a few details and we'll confirm your slot on WhatsApp."
      />
      <BookOpenBanner />
    </>
  );
}
