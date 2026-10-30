"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useBooking } from "@/components/BookingProvider";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/branches", label: "Branches" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { openBooking } = useBooking();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-9 sm:top-10 inset-x-0 z-50 transition-all duration-300 ${
          solid
            ? "bg-black/85 backdrop-blur-md border-b border-gold/15"
            : "bg-transparent"
        }`}
      >
        <div className="container-wide flex items-center justify-between py-3 sm:py-4">
          <Link href="/" aria-label="MIRRORS home" className="flex items-center gap-3">
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 overflow-hidden rounded-full ring-1 ring-gold/40">
              <Image
                src="/logo.png"
                alt="MIRRORS Unisex Salon & Academy"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-lg text-gold-light tracking-wide">
                MIRRORS
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
                Salon &amp; Academy
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const isAcademy = item.href === "/academy";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-xs uppercase tracking-[0.24em] transition-colors ${
                    active ? "text-gold" : "text-gold-pale/80 hover:text-gold"
                  }`}
                >
                  {item.label}
                  {isAcademy && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-gradient-gold text-black text-[8px] font-bold px-1.5 py-0.5 tracking-[0.15em] align-middle animate-pulse">
                      NEW
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openBooking()}
              className="btn-primary hidden md:inline-flex text-xs px-5 py-2.5"
            >
              Book Appointment
            </button>
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-full border border-gold/40 p-2 text-gold hover:bg-gold/10"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden bg-black-pure text-gold-pale">
          <div className="container-wide flex items-center justify-between py-4">
            <Link href="/" aria-label="MIRRORS home" className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-gold/40">
                <Image
                  src="/logo.png"
                  alt="MIRRORS"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <span className="font-display text-lg text-gold-light">MIRRORS</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="rounded-full border border-gold/40 p-2 text-gold hover:bg-gold/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="container-wide mt-8 space-y-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-baseline gap-3 font-display text-3xl text-gold-light hover:text-gold"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.href === "/academy" && (
                  <span className="inline-flex items-center justify-center rounded-full bg-gradient-gold text-black text-[10px] font-bold px-2 py-0.5 tracking-[0.15em] animate-pulse">
                    NEW
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-6">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openBooking();
                }}
                className="btn-primary w-full"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
