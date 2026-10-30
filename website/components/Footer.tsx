import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { BRANCH_LIST, CONTACT } from "@/data/branches";

const QUICK = [
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/branches", label: "Branches" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-black-pure text-gold-pale">
      <div className="container-wide grid gap-10 py-14 sm:py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-full ring-1 ring-gold/40">
              <Image src="/logo.png" alt="MIRRORS" fill sizes="56px" className="object-cover" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-xl text-gold-light">MIRRORS</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
                Salon &amp; Academy
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-gold-pale/70">
            Premium unisex salon &amp; professional beauty academy in Gunupur &amp; Rayagada,
            Odisha.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <SocialLink href={CONTACT.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={CONTACT.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>

        <div>
          <h4 className="eyebrow">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {QUICK.map((q) => (
              <li key={q.href}>
                <Link
                  href={q.href}
                  className="text-gold-pale/80 hover:text-gold transition-colors"
                >
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {BRANCH_LIST.map((b) => (
          <div key={b.id}>
            <h4 className="eyebrow">{b.name}</h4>
            <ul className="mt-4 space-y-2 text-sm text-gold-pale/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                <span>{b.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <a href={`tel:${b.phoneDial}`} className="hover:text-gold">
                  {b.phone}
                </a>
              </li>
              <li className="text-xs text-gold-pale/60">{b.hours}</li>
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gold/10">
        <div className="container-wide flex flex-col md:flex-row items-start md:items-center justify-between gap-3 py-5 text-xs text-gold-pale/60">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-gold" />
            <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
              {CONTACT.email}
            </a>
          </div>
          <div>
            © {new Date().getFullYear()} MIRRORS Unisex Salon &amp; Academy · Gunupur &amp;
            Rayagada, Odisha
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold transition"
    >
      {children}
    </a>
  );
}
