import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal, BookButton } from "@/components/ui";
import { BRANCH_LIST } from "@/data/branches";
import { branchWhatsAppUrl } from "@/lib/whatsapp";
import { MapPin, Phone, Clock, MessageCircle, Navigation } from "lucide-react";

export const metadata: Metadata = {
  title: "Branches — Gunupur & Rayagada",
  description:
    "Visit MIRRORS Unisex Salon & Academy at our Gunupur or Rayagada branch. Addresses, phone numbers, hours and directions."
};

export default function BranchesPage() {
  return (
    <>
      <PageHero
        eyebrow="Two Branches"
        title="Find MIRRORS Near You"
        subtitle="Both branches offer the full salon menu and our 3-month professional beauty academy."
      />

      <section className="bg-black-pure">
        <div className="container-wide py-16 sm:py-20 space-y-16">
          {BRANCH_LIST.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.05}>
              <div className="grid gap-8 lg:grid-cols-2 items-stretch">
                <div className="rounded-xl border border-gold/25 bg-charcoal/60 p-6 sm:p-10 flex flex-col">
                  <p className="eyebrow">{b.city}</p>
                  <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
                    {b.name}
                  </h2>
                  <div
                    className="mt-5 h-px w-20"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  />

                  <ul className="mt-6 space-y-4 text-sm text-gold-pale/85">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-gold" />
                      <span>{b.address}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gold" />
                      <a href={`tel:${b.phoneDial}`} className="link-underline">
                        {b.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gold" />
                      <span>{b.hours}</span>
                    </li>
                  </ul>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <BookButton branch={b.id} label={`Book at ${b.id}`} />
                    <a
                      href={branchWhatsAppUrl(b.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href={b.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      <Navigation className="h-4 w-4" />
                      Directions
                    </a>
                    <a
                      href={`tel:${b.phoneDial}`}
                      className="btn-outline"
                    >
                      <Phone className="h-4 w-4" />
                      Call now
                    </a>
                  </div>

                  <p className="mt-8 text-xs uppercase tracking-[0.22em] text-gold/80">
                    Salon &amp; Academy · Both offered at this branch
                  </p>
                </div>

                <div className="relative min-h-[320px] rounded-xl overflow-hidden ring-1 ring-gold/25 bg-charcoal">
                  {b.mapEmbed && !b.mapEmbed.startsWith("⟨") ? (
                    <iframe
                      src={b.mapEmbed}
                      title={`Map — ${b.name}`}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <a
                      href={b.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-8 hover:bg-gold/5 transition"
                    >
                      <MapPin className="h-10 w-10 text-gold" />
                      <p className="font-display text-2xl text-gold-light">
                        Map coming soon
                      </p>
                      <p className="text-xs text-gold-pale/70 max-w-xs">
                        Tap to open in Google Maps · Owner: paste your embed URL into{" "}
                        <code className="text-gold">⟨MAP_EMBED_{b.id.toUpperCase()}⟩</code>
                      </p>
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
