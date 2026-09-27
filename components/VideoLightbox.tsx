"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { videoUrl, type VideoAsset } from "@/data/videos";

export function VideoLightbox({
  video,
  onClose
}: {
  video: VideoAsset | null;
  onClose: () => void;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [video?.file]);

  useEffect(() => {
    if (!video) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          role="dialog"
          aria-modal
          aria-label={video.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black-pure/95 backdrop-blur-sm p-4 sm:p-8"
        >
          <button
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-4 right-4 rounded-full border border-gold/40 p-2 text-gold hover:bg-gold/10 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            <p className="eyebrow mb-3 text-center">{video.title}</p>
            <div className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-gold/40 shadow-gold-glow-lg bg-black">
              {/*
                Keep the <video> mounted even after an error. Some Chromium builds
                fire "error" on codec probe (HEVC on Windows) but the poster still
                displays and the raw R2 URL always works when opened directly.
                We DELIBERATELY omit the `type` attribute so the browser
                content-sniffs rather than rejecting based on container name.
              */}
              <video
                key={video.file}
                className="absolute inset-0 h-full w-full object-contain bg-black"
                controls
                autoPlay
                playsInline
                preload="auto"
                poster={video.poster}
                src={videoUrl(video.file)}
                onError={() => setFailed(true)}
                onCanPlay={() => setFailed(false)}
              />

              {/* Only show the fallback overlay if playback actually failed. */}
              {failed && (
                <a
                  href={videoUrl(video.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black-pure/80 backdrop-blur-sm text-gold-pale hover:text-gold transition text-center px-6"
                >
                  <ExternalLink className="h-8 w-8 text-gold" />
                  <span className="text-sm uppercase tracking-[0.22em] text-gold">
                    Open in new tab
                  </span>
                  <span className="text-xs text-gold-pale/70 max-w-xs">
                    This clip is in a format your current browser can&rsquo;t
                    decode (HEVC / .MOV). Safari and iOS play it directly, or
                    tap here to open it in a new tab.
                  </span>
                </a>
              )}
              <span className="pointer-events-none absolute inset-3 rounded-xl border border-gold/20" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
