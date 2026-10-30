import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { BookingProvider } from "@/components/BookingProvider";
import { BranchesJsonLd } from "@/components/BranchesJsonLd";
import { AnnouncementBar } from "@/components/AnnouncementBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mirrors-salon.example.com"),
  title: {
    default: "MIRRORS Unisex Salon & Academy — Gunupur & Rayagada",
    template: "%s • MIRRORS Salon & Academy"
  },
  description:
    "Premium unisex salon and professional beauty academy with branches in Gunupur and Rayagada, Odisha. Hair, skin, bridal, makeup, and a 3-month professional beauty course.",
  keywords: [
    "unisex salon Gunupur",
    "beauty parlour Rayagada",
    "beauty academy Odisha",
    "bridal makeup Gunupur",
    "bridal makeup Rayagada",
    "hair salon Rayagada district",
    "3 month beauty course Odisha",
    "MIRRORS salon"
  ],
  openGraph: {
    title: "MIRRORS Unisex Salon & Academy",
    description:
      "Where beauty meets craft — unisex salon & professional beauty academy in Gunupur and Rayagada, Odisha.",
    type: "website",
    images: ["/logo.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "MIRRORS Unisex Salon & Academy",
    description:
      "Premium unisex salon & 3-month professional beauty academy — Gunupur & Rayagada, Odisha.",
    images: ["/logo.png"]
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body>
        <BookingProvider>
          <AnnouncementBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </BookingProvider>
        <BranchesJsonLd />
      </body>
    </html>
  );
}
