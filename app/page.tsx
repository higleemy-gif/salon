import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Scissors,
  ShieldCheck,
  GraduationCap,
  Heart,
  Star,
  MapPin,
  Phone,
  ArrowRight
} from "lucide-react";
import { Reveal, SectionHeader, BookButton, EnrolButton } from "@/components/ui";
import { InteriorShowcase } from "@/components/InteriorShowcase";
import { WatchMirrors } from "@/components/WatchMirrors";
import { RemoteVideo } from "@/components/RemoteVideo";
import { SERVICE_CATEGORIES } from "@/data/services";
import { BRANCH_LIST } from "@/data/branches";
import { COURSE } from "@/data/curriculum";
import { INTERIOR_IMAGES } from "@/data/interior";
import { HERO_VIDEO } from "@/data/videos";

const TRUST = [
  "2 Branches",
  "Unisex",
  "Professional Academy",
  "Bridal Specialists",
  "Certified Training"
];

const USPS = [
  {
    icon: Scissors,
    title: "Expert Stylists",
    desc: "A senior team trained in the latest cuts, colour and grooming techniques."
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    desc: "Professional-grade brands for hair, skin and makeup — chosen with care."
  },
  {
    icon: ShieldCheck,
    title: "Hygiene & Care",
    desc: "Sanitised tools, single-use disposables, and a spotless salon environment."
  },
  {
    icon: GraduationCap,
    title: "Certified Academy",
    desc: "A structured 3-month professional course with live-model practice."
  }
];

const TESTIMONIALS = [
  {
    name: "⟨PLACEHOLDER⟩ Client",
    role: "Bride, Gunupur",
    quote:
      "My bridal makeup was flawless — I felt like the best version of myself. The team is caring, punctual, and truly professional."
  },
  {
    name: "⟨PLACEHOLDER⟩ Client",
    role: "Regular, Rayagada",
    quote:
      "The most premium salon experience in Rayagada district. Consistent quality every single visit."
  },
  {
    name: "⟨PLACEHOLDER⟩ Student",
    role: "Academy Graduate",
    quote:
      "The 3-month course changed my life. Real live models, honest feedback, and I now run my own studio."
  }
];

const GALLERY = [
  ...INTERIOR_IMAGES,
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80"
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden bg-black-pure">
        <div className="absolute inset-0">
          <RemoteVideo
            file={HERO_VIDEO.file}
            poster={HERO_VIDEO.poster}
            type={HERO_VIDEO.type}
            title={HERO_VIDEO.title}
            mode="hero"
            className="absolute inset-0 h-full w-full opacity-45"
            priorityPoster
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black-pure/80 via-black-pure/70 to-black-pure" />
        </div>

        <div className="relative container-narrow flex min-h-[100svh] flex-col items-center justify-center text-center pt-24 pb-16">
          <Reveal>
            <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full ring-2 ring-gold/60 shadow-gold-glow-lg">
              <Image src="/logo.png" alt="MIRRORS" fill sizes="120px" className="object-cover" priority />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mt-8">MIRRORS · Salon &amp; Academy</p>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 className="heading-serif mt-4 text-4xl sm:text-6xl md:text-7xl text-gold-light">
              Where Beauty
              <br />
              Meets <span className="italic text-gold">Craft</span>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base text-gold-pale/80">
              A premium unisex salon &amp; professional beauty academy —
              <br className="hidden sm:block" /> Gunupur • Rayagada, Odisha.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <BookButton />
              <Link href="/academy" className="btn-outline">
                Explore the Academy
              </Link>
            </div>
          </Reveal>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="h-10 w-px bg-gradient-to-b from-transparent via-gold to-transparent" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70">
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-gold/15 bg-charcoal/40">
        <div className="container-wide flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5 text-[11px] uppercase tracking-[0.25em] text-gold-pale/70">
          {TRUST.map((t, i) => (
            <div key={t} className="flex items-center gap-3">
              <span>{t}</span>
              {i < TRUST.length - 1 && <span className="text-gold/50">•</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / USP — cream section */}
      <section className="bg-cream text-ink">
        <div className="container-wide py-20 sm:py-24">
          <Reveal>
            <SectionHeader
              invert
              eyebrow="The MIRRORS Difference"
              title="Elevated Beauty, Everyday."
              subtitle="At MIRRORS, we blend precision craft with a warm, luxurious experience. Whether you visit our salon or train at our academy, you'll find the same commitment to excellence."
            />
          </Reveal>

          <div className="mt-12 flex sm:grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 no-scrollbar">
            {USPS.map((u, i) => (
              <Reveal
                key={u.title}
                delay={i * 0.08}
                className="snap-start shrink-0 w-[80%] sm:w-auto sm:shrink"
              >
                <div className="group relative rounded-xl border border-ink/10 bg-ivory p-6 h-full transition hover:border-gold/60 hover:shadow-gold-glow">
                  <div
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-black"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    <u.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl">{u.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{u.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section id="services-overview" className="bg-black-pure">
        <div className="container-wide py-20 sm:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="Our Services"
              title="Crafted for Every Occasion"
              subtitle="From everyday grooming to signature bridal transformations — explore our unisex service menu."
            />
          </Reveal>

          <div className="mt-12 flex sm:grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 no-scrollbar">
            {SERVICE_CATEGORIES.map((c, i) => (
              <Reveal
                key={c.id}
                delay={i * 0.05}
                className="snap-start shrink-0 w-[82%] sm:w-auto sm:shrink"
              >
                <Link
                  href={`/services#${c.id}`}
                  className="card-dark group block overflow-hidden h-full"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
                        {c.eyebrow}
                      </p>
                      <h3 className="font-display text-2xl text-gold-light mt-1">
                        {c.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-gold-pale/70 leading-relaxed">{c.blurb}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-gold group-hover:text-gold-light">
                      View services <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <BookButton />
          </div>
        </div>
      </section>

      {/* INSIDE MIRRORS — real parlour interior */}
      <InteriorShowcase />

      {/* WATCH MIRRORS — cinematic video feature */}
      <WatchMirrors />

      {/* BRIDAL HIGHLIGHT */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=2000&q=80"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black-pure/95 via-black-pure/70 to-black-pure/30" />
        </div>
        <div className="relative container-wide py-24 sm:py-32">
          <Reveal>
            <p className="eyebrow">Signature — Bridal</p>
            <h2 className="heading-serif mt-3 text-4xl sm:text-5xl md:text-6xl text-gold-light max-w-2xl">
              Your Wedding, <em className="text-gold">Immaculately</em> Yours.
            </h2>
            <p className="mt-5 max-w-xl text-gold-pale/80 leading-relaxed">
              HD &amp; airbrush makeup, bridal hairstyling, saree draping and mehendi —
              a full-day experience crafted for the Odisha bride and her wedding party.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton service="Bridal makeover" label="Book Bridal Consultation" />
              <Link href="/services#bridal" className="btn-outline">
                View Bridal Menu
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ACADEMY SPOTLIGHT */}
      <section id="academy" className="relative bg-black-pure overflow-hidden">
        {/* Ambient gold aura */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[1100px] max-w-full rounded-full opacity-[0.09] blur-3xl"
          style={{ backgroundImage: "var(--gradient-gold)" }}
        />

        <div className="relative container-wide py-20 sm:py-28">
          {/* Framed card with animated shimmer border */}
          <div className="relative rounded-2xl p-[1.5px] bg-[length:400%_400%] animate-shimmer"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(184,134,11,0.35) 0%, rgba(240,217,140,0.9) 25%, rgba(212,175,55,0.4) 55%, rgba(240,217,140,0.9) 80%, rgba(184,134,11,0.35) 100%)"
            }}
          >
            <div className="relative rounded-2xl bg-gradient-to-br from-charcoal via-black to-charcoal p-8 sm:p-14 overflow-hidden">
              {/* Corner glow */}
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              />

              <div className="relative grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
                <Reveal>
                  {/* "Now enrolling" pill */}
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-black"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
                    Now Enrolling
                  </span>

                  <p className="eyebrow mt-4">The Academy</p>
                  <h2 className="heading-serif mt-3 text-4xl sm:text-5xl md:text-6xl text-gold-light">
                    Learn. Practice. <em className="text-gold">Perform.</em>
                  </h2>
                  <p className="mt-5 text-gold-pale/85 leading-relaxed max-w-xl">
                    A structured{" "}
                    <strong className="text-gold-light">{COURSE.duration}</strong>{" "}
                    professional beauty course covering{" "}
                    <strong className="text-gold-light">{COURSE.focus}</strong> — with
                    theory, practical &amp; live-model training, and a certificate on
                    completion.
                  </p>

                  {/* Module icon chips */}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {[
                      { icon: "💇", label: "Hair" },
                      { icon: "🧖", label: "Skin" },
                      { icon: "💄", label: "Makeup" },
                      { icon: "💅", label: "Nails" },
                      { icon: "🧔", label: "Grooming" },
                      { icon: "🏆", label: "Management" }
                    ].map((m) => (
                      <li
                        key={m.label}
                        className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-black/40 px-3 py-1.5 text-xs text-gold-pale/85"
                      >
                        <span>{m.icon}</span>
                        <span className="uppercase tracking-[0.16em] text-[10px] font-medium">
                          {m.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Course stat pills */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-gold/40 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
                      {COURSE.duration}
                    </span>
                    <span className="rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
                      Theory + Practical + Live Model
                    </span>
                    <span className="rounded-full border border-gold/40 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
                      Certificate
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <EnrolButton label="Enrol on WhatsApp" />
                    <Link href="/academy" className="btn-outline">
                      View Full Curriculum
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={0.15}>
                  <div className="relative">
                    {/* Image with layered gold-ring frame echoing the logo */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl ring-1 ring-gold/40 shadow-gold-glow-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
                        alt="Academy in session"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black-pure/70 via-transparent to-transparent" />
                      <span className="pointer-events-none absolute inset-3 rounded-lg border border-gold/25" />

                      {/* Floating stat card */}
                      <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-gold/40 bg-black-pure/80 backdrop-blur-md p-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="font-display text-2xl text-gold-light">3</div>
                            <div className="text-[9px] uppercase tracking-[0.22em] text-gold-pale/70 mt-0.5">
                              Months
                            </div>
                          </div>
                          <div className="border-x border-gold/20">
                            <div className="font-display text-2xl text-gold-light">7</div>
                            <div className="text-[9px] uppercase tracking-[0.22em] text-gold-pale/70 mt-0.5">
                              Modules
                            </div>
                          </div>
                          <div>
                            <div className="font-display text-2xl text-gold-light">✓</div>
                            <div className="text-[9px] uppercase tracking-[0.22em] text-gold-pale/70 mt-0.5">
                              Certified
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANCHES TEASER */}
      <section className="bg-cream text-ink">
        <div className="container-wide py-20 sm:py-24">
          <Reveal>
            <SectionHeader
              invert
              eyebrow="Two Branches"
              title="Find MIRRORS Near You"
              subtitle="Both branches offer the complete salon menu and the academy programme."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {BRANCH_LIST.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08}>
                <div className="rounded-xl border border-ink/10 bg-ivory p-6 sm:p-8 h-full flex flex-col">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
                    {b.city}
                  </p>
                  <h3 className="font-display text-3xl mt-2">{b.name}</h3>
                  <div className="mt-4 space-y-2 text-sm text-muted">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-gold-deep" />
                      {b.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold-deep" />
                      <a href={`tel:${b.phoneDial}`}>{b.phone}</a>
                    </p>
                    <p className="text-xs">{b.hours}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <BookButton branch={b.id} label={`Book at ${b.id}`} />
                    <a
                      href={b.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] hover:border-gold-deep hover:text-gold-deep transition"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-black-pure">
        <div className="container-wide py-20 sm:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="A Little Sneak Peek"
              subtitle="Real work, real transformations — from the MIRRORS chair."
            />
          </Reveal>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GALLERY.map((src, i) => (
              <Reveal key={src} delay={i * 0.04}>
                <div
                  className={`relative overflow-hidden rounded-lg ring-1 ring-gold/20 hover:ring-gold/60 transition ${
                    i % 5 === 0 ? "aspect-[3/4]" : "aspect-square"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/gallery" className="btn-outline">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-charcoal/40 border-y border-gold/10">
        <div className="container-wide py-20 sm:py-24">
          <Reveal>
            <SectionHeader
              eyebrow="Kind Words"
              title="What Our Guests Say"
            />
          </Reveal>
          <div className="mt-12 flex md:grid gap-4 sm:gap-6 md:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0 pb-2 md:pb-0 no-scrollbar">
            {TESTIMONIALS.map((t, i) => (
              <Reveal
                key={i}
                delay={i * 0.08}
                className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-auto md:shrink"
              >
                <div className="card-dark p-6 sm:p-8 h-full flex flex-col">
                  <div className="flex text-gold mb-4" aria-label="5 star rating">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gold-pale/80 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 pt-5 border-t border-gold/15">
                    <p className="font-display text-gold-light">{t.name}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-gold-pale/60 mt-1">
                      {t.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black-pure">
        <div className="container-narrow py-24 text-center">
          <Reveal>
            <Heart className="mx-auto h-8 w-8 text-gold" />
            <h2 className="heading-serif mt-6 text-4xl sm:text-5xl md:text-6xl text-gold-light">
              Ready to Look Your <em className="text-gold">Best?</em>
            </h2>
            <p className="mt-4 text-gold-pale/70">
              Book your appointment in under a minute — we&rsquo;ll confirm on WhatsApp.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <BookButton />
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
