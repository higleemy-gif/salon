import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, BookButton } from "@/components/ui";
import { SERVICE_CATEGORIES } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Unisex Salon Menu",
  description:
    "The full MIRRORS salon menu: hair, skin, makeup, bridal, nails, men's grooming and spa — at our Gunupur and Rayagada branches."
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="The Complete Menu"
        subtitle="A full-service unisex salon experience — hair, skin, makeup, bridal, nails and men's grooming."
      />

      {/* Category anchor nav */}
      <nav
        aria-label="Service categories"
        className="sticky top-16 z-30 border-y border-gold/15 bg-black-pure/85 backdrop-blur"
      >
        <div className="container-wide overflow-x-auto">
          <ul className="flex gap-6 py-3 whitespace-nowrap text-[11px] uppercase tracking-[0.22em]">
            {SERVICE_CATEGORIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="text-gold-pale/70 hover:text-gold transition-colors"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {SERVICE_CATEGORIES.map((cat, idx) => (
        <section
          key={cat.id}
          id={cat.id}
          className={`scroll-mt-24 ${idx % 2 === 1 ? "bg-charcoal/40" : "bg-black-pure"}`}
        >
          <div className="container-wide py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.4fr] lg:gap-14 items-start">
              <Reveal>
                <div className="lg:sticky lg:top-32">
                  <p className="eyebrow">{cat.eyebrow}</p>
                  <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
                    {cat.title}
                  </h2>
                  <div
                    className="mt-5 h-px w-24"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  />
                  <p className="mt-5 text-gold-pale/75 leading-relaxed">{cat.blurb}</p>
                  <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-xl ring-1 ring-gold/25">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <ul className="divide-y divide-gold/10 rounded-xl border border-gold/20 bg-charcoal/60 overflow-hidden">
                  {cat.services.map((s) => (
                    <li
                      key={s.name}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 hover:bg-gold/[0.03] transition"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-gold-light font-medium">{s.name}</span>
                          {s.audience && (
                            <span className="text-[10px] uppercase tracking-[0.22em] rounded-full border border-gold/30 px-2 py-0.5 text-gold/80">
                              {s.audience}
                            </span>
                          )}
                        </div>
                        {s.desc && (
                          <p className="mt-1 text-sm text-gold-pale/60">{s.desc}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-gold-pale/70">
                          {s.price || "On enquiry"}
                        </span>
                        <BookButton
                          service={s.name}
                          label="Book"
                          variant="outline"
                          className="text-[11px] px-4 py-2"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* Sticky final CTA */}
      <section className="bg-black-pure">
        <div className="container-narrow py-20 text-center">
          <p className="eyebrow">Ready?</p>
          <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
            Reserve Your Chair
          </h2>
          <p className="mt-4 text-gold-pale/70">
            Choose your branch, pick a service, and we&rsquo;ll confirm on WhatsApp.
          </p>
          <div className="mt-8">
            <BookButton />
          </div>
        </div>
      </section>
    </>
  );
}
