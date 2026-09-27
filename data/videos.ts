// Direct-streamed video assets on Cloudflare R2.
// NOTE: The .MOV files are QuickTime containers and may not decode in every
// browser (Firefox/Chrome on Windows/Linux without HEVC codecs). They render
// on Safari, iOS, and Chromium on macOS reliably. Posters ensure the tiles
// always look great even when playback isn't supported.

export const VIDEO_BASE = "https://pub-9484535a72844cadad6bd50cce517317.r2.dev";

export type VideoAsset = {
  file: string;         // exact object key on R2
  title: string;        // human title used in UI
  poster: string;       // static image shown before/while loading
  type: string;         // MIME type
};

const P = (n: string) => `/interior/${n}`;

export const VIDEOS: VideoAsset[] = [
  { file: "IMG_4452.MOV", title: "Bridal Look",        poster: P("img_5245.jpg"), type: "video/quicktime" },
  { file: "IMG_4480.MOV", title: "Studio Moments",     poster: P("img_5243.jpg"), type: "video/quicktime" },
  { file: "IMG_4483.MOV", title: "Hair Craft",         poster: P("img_5239.jpg"), type: "video/quicktime" },
  { file: "IMG_4515.MOV", title: "Colour Story",       poster: P("img_5246.jpg"), type: "video/quicktime" },
  { file: "IMG_4519.MOV", title: "Behind the Chair",   poster: P("img_5240.jpg"), type: "video/quicktime" },
  { file: "IMG_4520.MOV", title: "Signature Finish",   poster: P("img_5244.jpg"), type: "video/quicktime" },
  { file: "IMG_4521.MOV", title: "Detail Work",        poster: P("img_5247.jpg"), type: "video/quicktime" },
  { file: "IMG_4684.MP4", title: "Salon Reel",         poster: P("img_5245.jpg"), type: "video/mp4"       },
  { file: "IMG_4877.MOV", title: "Academy in Session", poster: P("img_5243.jpg"), type: "video/quicktime" },
  { file: "IMG_5088.MOV", title: "The MIRRORS Space",  poster: P("img_5239.jpg"), type: "video/quicktime" }
];

export const videoUrl = (file: string) => `${VIDEO_BASE}/${file}`;

// Curated roles used across the site.
// The MP4 (H.264) plays inline on every browser (Chrome/Edge/Firefox on
// Windows all decode H.264 natively) so we use it for BOTH the hero background
// AND the "Watch MIRRORS" feature player.
export const HERO_VIDEO      = VIDEOS.find((v) => v.file === "IMG_4684.MP4")!;
export const FEATURE_VIDEO   = VIDEOS.find((v) => v.file === "IMG_4684.MP4")!;
// Gallery excludes the hero/feature clip so it's not repeated three times on the page.
export const GALLERY_VIDEOS  = VIDEOS.filter((v) => v.file !== HERO_VIDEO.file);
