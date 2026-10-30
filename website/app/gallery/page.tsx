import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal, BookButton } from "@/components/ui";
import { VideoGrid } from "@/components/VideoGrid";
import { INTERIOR_IMAGES } from "@/data/interior";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Step inside MIRRORS Unisex Salon & Academy — real interior photos, work highlights and transformations from our Gunupur and Rayagada branches."
};

// Work / lifestyle photography (stock — swap for owner's real work photos later).
const WORK_IMAGES = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560869713-7d0954430ba1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80"
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A Look Inside MIRRORS"
        subtitle="Our space, our craft — real photos and videos from the MIRRORS parlour and stylist chair."
      />

      {/* VIDEOS — featured at the top */}
      <section id="videos" className="bg-black-pure">
        <div className="container-wide py-16 sm:py-20">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="eyebrow">Videos</p>
                <h2 className="heading-serif mt-3 text-3xl sm:text-4xl md:text-5xl text-gold-light">
                  MIRRORS, In Motion
                </h2>
                <div
                  className="mt-5 h-px w-24"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                />
              </div>
              <p className="max-w-md text-sm text-gold-pale/70">
                Bridal transformations, hair craft, and behind-the-chair moments.
                Tap any tile to watch.
              </p>
            </div>
          </Reveal>

          <div className="mt-12">
            <VideoGrid />
          </div>
        </div>
      </section>

      {/* OUR SPACE — real interior photos, featured */}
      <section id="our-space" className="bg-charcoal/40 border-y border-gold/10">
        <div className="container-wide py-16 sm:py-20">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="eyebrow">Our Space</p>
                <h2 className="heading-serif mt-3 text-3xl sm:text-4xl md:text-5xl text-gold-light">
                  Inside the Parlour
                </h2>
                <div
                  className="mt-5 h-px w-24"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                />
              </div>
              <p className="max-w-md text-sm text-gold-pale/70">
                A calm, luxurious setting designed around your comfort — soft lighting,
                premium stations, and attention to every last detail.
              </p>
            </div>
          </Reveal>

          {/* Featured mosaic layout */}
          <div className="mt-12 grid gap-4 md:grid-cols-4 md:grid-rows-2 md:auto-rows-fr">
            {INTERIOR_IMAGES.map((src, i) => {
              // First image is the big feature spanning 2x2, others are square.
              const spanClass =
                i === 0
                  ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto"
                  : "aspect-square";
              return (
                <Reveal key={src} delay={i * 0.04}>
                  <div
                    className={`group relative overflow-hidden rounded-xl ring-1 ring-gold/25 hover:ring-gold/60 transition ${spanClass}`}
                  >
                    <Image
                      src={src}
                      alt={`MIRRORS Salon interior ${i + 1}`}
                      fill
                      sizes={
                        i === 0
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 50vw, 25vw"
                      }
                      className="object-cover transition-transform duration-[1000ms] group-hover:scale-[1.05]"
                      priority={i === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black-pure/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 p-5 sm:p-7">
                        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/50 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-gold">
                          The Studio
                        </span>
                        <h3 className="heading-serif mt-3 text-xl sm:text-2xl text-gold-light">
                          Where you feel at home.
                        </h3>
                      </div>
                    )}
                    <span className="pointer-events-none absolute inset-2 rounded-lg border border-gold/15" />
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <BookButton label="Book Your Visit" />
          </div>
        </div>
      </section>

      {/* OUR WORK — placeholders for now */}
      <section id="our-work" className="bg-black-pure">
        <div className="container-wide py-16 sm:py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">Our Work</p>
              <h2 className="heading-serif mt-3 text-3xl sm:text-4xl md:text-5xl text-gold-light">
                Transformations &amp; Highlights
              </h2>
              <div
                className="mx-auto mt-5 h-px w-24"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              />
            </div>
          </Reveal>

          <div className="mt-12 columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
            {WORK_IMAGES.map((src, i) => (
              <Reveal key={src} delay={(i % 6) * 0.04}>
                <div
                  className={`mb-3 break-inside-avoid overflow-hidden rounded-lg ring-1 ring-gold/20 hover:ring-gold/60 transition ${
                    i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"
                  } relative`}
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

          <p className="mt-10 text-center text-sm text-gold-pale/60">
            ⟨PLACEHOLDER⟩ — swap the &ldquo;Our Work&rdquo; images for real client photos when they&rsquo;re ready.
          </p>
          <div className="mt-6 flex justify-center">
            <BookButton />
          </div>
        </div>
      </section>
    </>
  );
}
