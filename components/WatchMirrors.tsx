"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Reveal, BookButton } from "@/components/ui";
import { RemoteVideo } from "@/components/RemoteVideo";
import { VideoLightbox } from "@/components/VideoLightbox";
import { FEATURE_VIDEO, GALLERY_VIDEOS, type VideoAsset } from "@/data/videos";

/**
 * Cinematic feature block on the home page.
 * - Large 16:9 hero player (click-to-unmute) using the MP4 asset (best compatibility)
 * - 3 thumbnail chips underneath that open a fullscreen video lightbox
 */
export function WatchMirrors() {
  const [active, setActive] = useState<VideoAsset | null>(null);
  const thumbs = GALLERY_VIDEOS.slice(0, 3);

  return (
    <section id="watch" className="relative overflow-hidden bg-black-pure">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-60 w-[900px] max-w-full rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundImage: "var(--gradient-gold)" }}
      />

      <div className="relative container-wide py-20 sm:py-28">
        <div className="text-center">
          <Reveal>
            <p className="eyebrow">Watch MIRRORS</p>
            <h2 className="heading-serif mt-3 text-4xl sm:text-5xl md:text-6xl text-gold-light">
              A Look, In <em className="text-gold">Motion</em>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm sm:text-base text-gold-pale/75">
              Craft, care and craft again — see MIRRORS in a way that photos alone can&rsquo;t show.
            </p>
            <div
              className="mx-auto mt-7 h-px w-24"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            />
          </Reveal>
        </div>

        {/* Main feature player */}
        <Reveal delay={0.05}>
          <div className="mt-12 mx-auto max-w-5xl">
            <RemoteVideo
              file={FEATURE_VIDEO.file}
              poster={FEATURE_VIDEO.poster}
              type={FEATURE_VIDEO.type}
              title={FEATURE_VIDEO.title}
              mode="player"
              className="relative aspect-video rounded-2xl ring-1 ring-gold/30 shadow-gold-glow-lg"
              priorityPoster
            >
              <span className="pointer-events-none absolute inset-3 rounded-xl border border-gold/20" />
              <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/50 backdrop-blur px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
                  <Play className="h-3 w-3 fill-current" /> Salon Reel
                </span>
              </div>
            </RemoteVideo>
          </div>
        </Reveal>

        {/* Thumbnail row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
          {thumbs.map((v, i) => (
            <Reveal key={v.file} delay={0.1 + i * 0.05}>
              <button
                onClick={() => setActive(v)}
                className="group relative aspect-video w-full overflow-hidden rounded-xl ring-1 ring-gold/25 hover:ring-gold/60 transition"
                aria-label={`Play ${v.title}`}
              >
                <img
                  src={v.poster}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-pure/70 via-black-pure/20 to-transparent" />
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-black transition-transform group-hover:scale-110"
                    style={{ backgroundImage: "var(--gradient-gold)" }}
                  >
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </span>
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold">
                    Watch
                  </p>
                  <p className="mt-0.5 font-display text-lg text-gold-light truncate">
                    {v.title}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <BookButton label="Book Your Visit" />
        </div>
      </div>

      <VideoLightbox video={active} onClose={() => setActive(null)} />
    </section>
  );
}
