"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { VIDEOS, type VideoAsset } from "@/data/videos";
import { VideoLightbox } from "@/components/VideoLightbox";
import { Reveal } from "@/components/ui";

/**
 * Grid of all videos on the Gallery page. Click a tile → fullscreen lightbox.
 */
export function VideoGrid() {
  const [active, setActive] = useState<VideoAsset | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEOS.map((v, i) => (
          <Reveal key={v.file} delay={(i % 6) * 0.05}>
            <button
              onClick={() => setActive(v)}
              className="group relative aspect-video w-full overflow-hidden rounded-xl ring-1 ring-gold/25 hover:ring-gold/60 transition"
              aria-label={`Play ${v.title}`}
            >
              <img
                src={v.poster}
                alt=""
                className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-pure/75 via-black-pure/20 to-transparent" />
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full text-black transition-transform group-hover:scale-110 shadow-gold-glow"
                  style={{ backgroundImage: "var(--gradient-gold)" }}
                >
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </span>
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">
                  Watch
                </p>
                <p className="mt-1 font-display text-lg text-gold-light truncate">
                  {v.title}
                </p>
              </div>
              <span className="pointer-events-none absolute inset-2 rounded-lg border border-gold/15" />
            </button>
          </Reveal>
        ))}
      </div>
      <VideoLightbox video={active} onClose={() => setActive(null)} />
    </>
  );
}
