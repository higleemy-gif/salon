import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, EnrolButton } from "@/components/ui";
import { COURSE, MODULES } from "@/data/curriculum";
import {
  Award,
  Users,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "Academy — 3-Month Professional Beauty Course",
  description:
    "MIRRORS Salon & Academy offers a 3-month professional beauty course covering skin, hair and makeup with theory, practical and live-model training. Certificate on completion."
};

const HIGHLIGHTS = [
  { icon: BookOpen, label: "Theory + Practical + Live Model" },
  { icon: Users, label: "Small batches, personal mentoring" },
  { icon: Award, label: "Certificate on completion" },
  { icon: ClipboardCheck, label: "Structured assessments" }
];

const WHO_FOR = [
  "Beginners starting a career in beauty",
  "Working professionals upskilling with advanced techniques",
  "Salon owners &amp; makeup artists seeking a certified programme",
  "Anyone passionate about hair, skin and makeup"
];

const WHAT_YOU_GET = [
  "Full 3-month professional training",
  "Practical sessions on live models",
  "Product &amp; brand knowledge",
  "Consultation &amp; salon-management skills",
  "Certificate from MIRRORS Salon &amp; Academy",
  "Post-course guidance"
];

const HOW_IT_WORKS = [
  {
    step: "Month 1",
    title: "Foundations",
    desc: "Skin analysis, hair &amp; scalp science, tools, hygiene, product knowledge and consultation."
  },
  {
    step: "Month 2",
    title: "Craft",
    desc: "Advanced cutting, colour, spa &amp; texture treatments, facials, waxing, and makeup fundamentals."
  },
  {
    step: "Month 3",
    title: "Performance",
    desc: "HD &amp; bridal makeup, hairstyling, salon management, live-model practice and final assessment."
  }
];

const FAQ = [
  {
    q: "What are the course fees?",
    a: "Please enquire on WhatsApp — we'll share the current fee structure, batch dates and any ongoing offers."
  },
  {
    q: "Where can I attend the course?",
    a: "At either of our branches — Gunupur or Rayagada. Choose the location that suits you when you enquire."
  },
  {
    q: "What are the batch timings?",
    a: "⟨PLACEHOLDER⟩ — please enquire on WhatsApp for the next batch schedule and available slots."
  },
  {
    q: "Do I need prior experience?",
    a: "No prior experience is required. The programme starts from fundamentals and progresses to advanced techniques."
  },
  {
    q: "Will I receive a certificate?",
    a: "Yes — students who successfully complete the training and final assessment receive a certificate from MIRRORS Salon & Academy."
  }
];

export default function AcademyPage() {
  return (
    <>
      <PageHero
        eyebrow="MIRRORS Salon & Academy"
        title="3-Month Professional Beauty Course"
        subtitle="Skin + Hair + Makeup. Theory, practical and live-model training. Certificate on completion."
      />

      {/* Course summary card */}
      <section className="bg-black-pure">
        <div className="container-wide">
          <div className="mx-auto -mt-4 max-w-4xl rounded-2xl border border-gold/30 bg-gradient-to-br from-charcoal to-black p-6 sm:p-10 shadow-gold-glow">
            <div className="grid gap-6 sm:grid-cols-3">
              <Fact label="Course" value={COURSE.focus} />
              <Fact label="Duration" value={COURSE.duration} highlight />
              <Fact label="Training" value={COURSE.training} />
            </div>
            <div className="gold-hairline my-8" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gold-pale/75 text-center sm:text-left">
                Choose your preferred location and chat with admissions on WhatsApp.
              </p>
              <div className="flex gap-3">
                <EnrolButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights strip */}
      <section className="bg-black-pure">
        <div className="container-wide py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-xl border border-gold/20 bg-charcoal/60 p-5">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-black shrink-0"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    <h.icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-gold-pale/85">{h.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="bg-charcoal/40 border-y border-gold/10">
        <div className="container-wide py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">The Curriculum</p>
              <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
                Every Module, In Detail
              </h2>
              <div
                className="mx-auto mt-6 h-px w-24"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              />
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {MODULES.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.05}>
                <div className="card-dark p-6 sm:p-8 h-full">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{m.icon}</span>
                    <h3 className="font-display text-2xl text-gold-light">{m.title}</h3>
                  </div>
                  <div
                    className="mt-4 h-px w-16"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  />
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gold-pale/80">
                    {m.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-gold shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for + What you get */}
      <section className="bg-black-pure">
        <div className="container-wide py-20 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-8 h-full">
              <p className="eyebrow">Who this is for</p>
              <h3 className="heading-serif mt-3 text-3xl text-gold-light">
                Perfect if you&hellip;
              </h3>
              <ul className="mt-6 space-y-3 text-sm text-gold-pale/80">
                {WHO_FOR.map((w) => (
                  <li
                    key={w}
                    className="flex items-start gap-2"
                    dangerouslySetInnerHTML={{
                      __html: `<span class="text-gold mt-1">◆</span><span>${w}</span>`
                    }}
                  />
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-gold/20 bg-charcoal/60 p-8 h-full">
              <p className="eyebrow">What you get</p>
              <h3 className="heading-serif mt-3 text-3xl text-gold-light">
                Included in your fees
              </h3>
              <ul className="mt-6 space-y-3 text-sm text-gold-pale/80">
                {WHAT_YOU_GET.map((w) => (
                  <li
                    key={w}
                    className="flex items-start gap-2"
                    dangerouslySetInnerHTML={{
                      __html: `<span class="text-gold mt-1">✦</span><span>${w}</span>`
                    }}
                  />
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream text-ink">
        <div className="container-wide py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">How it works</p>
              <h2 className="heading-serif mt-3 text-4xl sm:text-5xl">
                A 3-Month Path to Professional
              </h2>
              <div
                className="mx-auto mt-6 h-px w-24"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              />
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08}>
                <div className="relative rounded-xl border border-ink/10 bg-ivory p-8 h-full">
                  <div className="text-[11px] uppercase tracking-[0.28em] text-gold-deep">
                    {s.step}
                  </div>
                  <h3
                    className="font-display text-2xl mt-2"
                    dangerouslySetInnerHTML={{ __html: s.title }}
                  />
                  <p
                    className="mt-3 text-sm text-muted leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: s.desc }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promise & Certificate */}
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black-pure/80" />
        <div className="relative container-narrow py-24 text-center">
          <Reveal>
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <p className="eyebrow mt-6">Our Training Promise</p>
            <h2 className="heading-serif mt-4 text-4xl sm:text-5xl text-gold-light">
              Learn · Practice · Perform · <em className="text-gold">Become Professional</em>
            </h2>
            <p className="mt-6 italic text-gold-pale/85">
              &ldquo;Professional Beauty Education for Your Career.&rdquo;
            </p>
            <div className="mt-10 rounded-xl border border-gold/30 bg-charcoal/60 p-8 max-w-lg mx-auto">
              <Award className="mx-auto h-8 w-8 text-gold" />
              <h3 className="heading-serif mt-4 text-2xl text-gold-light">Certificate</h3>
              <p className="mt-3 text-sm text-gold-pale/80">
                Successful students receive a <strong>Certificate from Mirrors Saloon &amp; Academy</strong>{" "}
                after completion and assessment.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black-pure">
        <div className="container-narrow py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">Admissions FAQ</p>
              <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
                Common Questions
              </h2>
              <div
                className="mx-auto mt-6 h-px w-24"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              />
            </div>
          </Reveal>

          <div className="mt-12 space-y-4">
            {FAQ.map((f, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <details className="group rounded-xl border border-gold/20 bg-charcoal/50 p-5 open:border-gold/60 open:shadow-gold-glow">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-gold-light">
                    {f.q}
                    <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 text-gold text-lg group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-gold-pale/75 leading-relaxed">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <EnrolButton />
          </div>
        </div>
      </section>
    </>
  );
}

function Fact({
  label,
  value,
  highlight
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center sm:text-left">
      <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{label}</p>
      <p
        className={`mt-2 font-display ${
          highlight ? "text-3xl text-gold" : "text-xl text-gold-light"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
