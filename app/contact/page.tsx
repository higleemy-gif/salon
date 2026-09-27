import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal, BookButton, EnrolButton } from "@/components/ui";
import { BRANCH_LIST, CONTACT } from "@/data/branches";
import { Mail, Phone, MapPin, Clock, MessageCircle, Instagram, Facebook } from "lucide-react";
import { branchWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with MIRRORS Unisex Salon & Academy in Gunupur or Rayagada. Phone, WhatsApp, address and social."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say Hello"
        subtitle="Book an appointment, enquire about the academy, or ask us anything — we're happy to help."
      />

      <section className="bg-black-pure">
        <div className="container-wide py-16 sm:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {BRANCH_LIST.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.06}>
                <div className="card-dark p-6 sm:p-8 h-full">
                  <p className="eyebrow">{b.city}</p>
                  <h2 className="heading-serif mt-3 text-3xl text-gold-light">
                    {b.name}
                  </h2>
                  <ul className="mt-6 space-y-3 text-sm text-gold-pale/85">
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
                  <div className="mt-6 flex flex-wrap gap-3">
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
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-gold/20 bg-charcoal/50 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div>
              <p className="eyebrow">General</p>
              <div className="mt-3 flex items-center gap-2 text-gold-pale/85">
                <Mail className="h-4 w-4 text-gold" />
                <a href={`mailto:${CONTACT.email}`} className="link-underline">
                  {CONTACT.email}
                </a>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <SocialLink href={CONTACT.instagram} label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialLink>
                <SocialLink href={CONTACT.facebook} label="Facebook">
                  <Facebook className="h-4 w-4" />
                </SocialLink>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <BookButton />
              <EnrolButton variant="outline" label="Academy Enquiry" />
            </div>
          </div>
        </div>
      </section>
    </>
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
