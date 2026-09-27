"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { videoUrl } from "@/data/videos";

type Props = {
  file: string;
  poster: string;
  type?: string;
  title?: string;
  /**
   * "background"  → muted, loop, autoplay when scrolled into view. No controls.
   * "hero"        → same as background, but sits behind hero copy (opacity handled by parent).
   * "player"      → shows a play overlay; on click, unmutes and plays with native controls.
   */
  mode?: "background" | "hero" | "player";
  className?: string;
  /** Object-fit — defaults to cover. */
  fit?: "cover" | "contain";
  /** For "player" mode: extra content to render inside the frame (badges etc.). */
  children?: React.ReactNode;
  /** Priority poster (LCP). */
  priorityPoster?: boolean;
};

export function RemoteVideo({
  file,
  poster,
  type = "video/mp4",
  title,
  mode = "background",
  className,
  fit = "cover",
  children,
  priorityPoster = false
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const src = videoUrl(file);
  const bg = mode !== "player";

  // Only start loading when the element is near the viewport.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Autoplay background / hero videos when they enter view, unless reduced motion.
  useEffect(() => {
    if (!bg || !inView || reduce) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [bg, inView, reduce]);

  const handlePlayClick = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.controls = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    setPlaying(true);
  };

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className || ""}`}>
      {/* Poster layer — always rendered so the frame never looks empty. */}
      <Image
        src={poster}
        alt={title || "MIRRORS video preview"}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className={`object-${fit} pointer-events-none transition-opacity duration-700 ${
          !failed && (playing || bg) ? "opacity-0" : "opacity-100"
        }`}
        priority={priorityPoster}
      />

      {inView && !failed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-${fit}`}
          preload="metadata"
          playsInline
          muted={bg}
          loop={bg}
          autoPlay={bg && !reduce}
          controls={mode === "player" && playing}
          poster={poster}
          src={src}
          onError={() => setFailed(true)}
        />
      )}

      {/* Play overlay for "player" mode. */}
      {mode === "player" && !playing && (
        <button
          onClick={handlePlayClick}
          aria-label={`Play ${title || "video"}`}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition group"
        >
          <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full text-black shadow-gold-glow-lg transition-transform group-hover:scale-110"
            style={{ backgroundImage: "var(--gradient-gold)" }}>
            <Play className="h-7 w-7 fill-current ml-1" />
            <span className="absolute inset-0 rounded-full animate-ping bg-gold/60 opacity-25" />
          </span>
        </button>
      )}

      {/* Fallback UI if playback fails (browser can't decode HEVC/MOV) */}
      {failed && (
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black-pure/60 text-center p-6 text-gold-pale hover:bg-black-pure/50 transition"
          aria-label={`Open ${title || "video"} in a new tab`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full text-black" style={{ backgroundImage: "var(--gradient-gold)" }}>
            <Play className="h-6 w-6 fill-current ml-0.5" />
          </span>
          <span className="text-xs uppercase tracking-[0.24em] text-gold">Open Video</span>
        </a>
      )}

      {children}
    </div>
  );
}
