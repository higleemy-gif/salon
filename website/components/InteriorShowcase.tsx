"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { INTERIOR_SHOWCASE } from "@/data/interior";
import { Reveal, BookButton } from "@/components/ui";

/**
 * A dedicated section highlighting the real MIRRORS parlour interior.
 * - Editorial split layout: one hero feature + a mosaic of 5 supporting frames
 * - Gold hairline framing echoes the logo's rings
 * - All images use next/image for optimization
 */
export function InteriorShowcase() {
  const reduce = useReducedMotion();
  const [a, b, c, d, e] = INTERIOR_SHOWCASE.gallery;

  return (
    <section
      id="inside"
      className="relative overflow-hidden bg-black-pure"
    >
      {/* Soft gold glow behind the section */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[900px] max-w-full rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />

      <div className="relative container-wide py-20 sm:py-28">
        {/* Header */}
        <div className="text-center">
          <Reveal>
            <p className="eyebrow">Inside MIRRORS</p>
            <h2 className="heading-serif mt-3 text-4xl sm:text-5xl md:text-6xl text-gold-light">
              Step Into Our <em className="text-gold">Space</em>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-gold-pale/75">
              A calm, luxurious parlour designed around you — soft lighting, premium
              stations and every detail thought through.
            </p>
            <div
              className="mx-auto mt-7 h-px w-24"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
          </Reveal>
        </div>

        {/* Hero feature + side mosaic */}
        <div className="mt-14 grid gap-4 sm:gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal>
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.01 }}
              transition={{ duration: 0.4 }}
              className="group relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto lg:h-full overflow-hidden rounded-2xl ring-1 ring-gold/30 shadow-gold-glow"
            >
              <Image
                src={INTERIOR_SHOWCASE.feature}
                alt="MIRRORS Salon interior — main styling floor"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/50 backdrop-blur px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
                  <Sparkles className="h-3 w-3" /> Our Studio
                </span>
                <h3 className="heading-serif mt-4 text-2xl sm:text-3xl text-gold-light">
                  Crafted for how it feels, not just how it looks.
                </h3>
              </div>
              {/* Corner gold hairlines echoing the logo rings */}
              <span className="pointer-events-none absolute inset-3 rounded-xl border border-gold/20" />
            </motion.div>
          </Reveal>

          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            <InteriorFrame src={a} alt="MIRRORS Salon interior detail" className="aspect-square" delay={0.05} />
            <InteriorFrame src={b} alt="MIRRORS Salon interior detail" className="aspect-square" delay={0.1} />
            <InteriorFrame src={c} alt="MIRRORS Salon interior detail" className="aspect-square" delay={0.15} />
            <InteriorFrame src={d} alt="MIRRORS Salon interior detail" className="aspect-square" delay={0.2} />
            <InteriorFrame
              src={e}
              alt="MIRRORS Salon interior detail"
              className="col-span-2 aspect-[16/9]"
              delay={0.25}
            />
          </div>
        </div>

        {/* Feature highlights row */}
        <div className="mt-14 flex sm:grid gap-4 sm:gap-6 sm:grid-cols-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 sm:pb-0 no-scrollbar">
          {[
            {
              title: "Premium Stations",
              desc: "Professional-grade chairs, lighting and equipment at every station."
            },
            {
              title: "Hygienic by Design",
              desc: "Sanitized tools, disposables and spotless surfaces — every visit."
            },
            {
              title: "Calm & Elegant",
              desc: "A composed atmosphere so your appointment feels like an escape."
            }
          ].map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 0.08}
              className="snap-start shrink-0 w-[80%] sm:w-auto sm:shrink"
            >
              <div className="rounded-xl border border-gold/20 bg-charcoal/50 p-6 h-full">
                <div
                  className="h-px w-10"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                />
                <h4 className="font-display text-xl text-gold-light mt-4">{f.title}</h4>
                <p className="mt-2 text-sm text-gold-pale/75 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <BookButton label="Book Your Visit" />
        </div>
      </div>
    </section>
  );
}

function InteriorFrame({
  src,
  alt,
  className,
  delay = 0
}: {
  src: string;
  alt: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={reduce ? undefined : { scale: 1.02 }}
        transition={{ duration: 0.35 }}
        className={`group relative overflow-hidden rounded-xl ring-1 ring-gold/25 hover:ring-gold/60 transition ${className || ""}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 45vw, 25vw"
          className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black-pure/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </Reveal>
  );
}
