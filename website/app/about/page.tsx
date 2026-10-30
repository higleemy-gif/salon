import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal, BookButton, EnrolButton } from "@/components/ui";
import { Award, Heart, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind MIRRORS Unisex Salon & Academy — a premium beauty brand with branches in Gunupur and Rayagada, Odisha."
};

const VALUES = [
  {
    icon: Heart,
    title: "Care First",
    desc: "Every guest is treated with warmth, attention and a personal consultation."
  },
  {
    icon: Sparkles,
    title: "Craft & Detail",
    desc: "We obsess over the finish — the little details that make a big difference."
  },
  {
    icon: Award,
    title: "Standards",
    desc: "Premium products, senior stylists, and a hygiene-first environment."
  },
  {
    icon: Users,
    title: "Community",
    desc: "We train the next generation of beauty professionals through our academy."
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="The MIRRORS Story"
        subtitle="A premium unisex salon and professional beauty academy proudly rooted in Gunupur & Rayagada, Odisha."
      />

      <section className="bg-black-pure">
        <div className="container-wide py-16 sm:py-20 grid gap-12 lg:grid-cols-2 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl ring-1 ring-gold/25 shadow-gold-glow">
              <Image
                src="/interior/img_5240.jpg"
                alt="Inside MIRRORS Salon & Academy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="pointer-events-none absolute inset-3 rounded-lg border border-gold/20" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our Story</p>
            <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
              Beauty, crafted with intention.
            </h2>
            <div
              className="mt-5 h-px w-20"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
            <div className="mt-6 space-y-5 text-gold-pale/80 leading-relaxed">
              <p>
                MIRRORS was built on a simple idea — that everyone deserves a beauty
                experience that feels genuinely premium, close to home. From bridal
                transformations to a quick trim, our team pours the same craft into
                every appointment.
              </p>
              <p>
                Alongside our salon, we run a professional academy — training the
                next generation of beauty specialists across skin, hair and makeup,
                with theory, practical &amp; live-model sessions.
              </p>
              <p className="text-gold-pale/60 text-sm italic">
                ⟨PLACEHOLDER⟩ — replace with the owner&rsquo;s original story from{" "}
                <code>⟨EXISTING_SITE_URL⟩</code>.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton />
              <EnrolButton
                label="Explore the Academy"
                variant="outline"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-charcoal/40 border-y border-gold/10">
        <div className="container-wide py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">What we stand for</p>
              <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
                Our Values
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 flex sm:grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 no-scrollbar">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 0.06}
                className="snap-start shrink-0 w-[80%] sm:w-auto sm:shrink"
              >
                <div className="card-dark p-6 h-full">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-black"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    <v.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-xl text-gold-light mt-4">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm text-gold-pale/75 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black-pure">
        <div className="container-narrow py-20 text-center">
          <Reveal>
            <p className="eyebrow">Come Visit</p>
            <h2 className="heading-serif mt-3 text-4xl sm:text-5xl text-gold-light">
              Two branches. One standard.
            </h2>
            <p className="mt-4 text-gold-pale/70">
              Gunupur &amp; Rayagada — both offering the full salon and academy experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/branches" className="btn-outline">
                See Branches
              </Link>
              <BookButton />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
