// -----------------------------------------------------------------------------
// MIRRORS — transcode R2 videos to universal-browser H.264 MP4.
//
// Why:
//   The .MOV files in R2 are HEVC (H.265). Windows Chrome/Edge/Firefox cannot
//   decode HEVC. Transcoding to H.264 MP4 fixes playback for every browser.
//
// What this does:
//   1. Downloads each .MOV / .MP4 from R2 into a scratch folder OUTSIDE the
//      project (default: ../mirrors-transcoded next to the repo). Nothing
//      enters the project.
//   2. Runs ffmpeg to produce an H.264 + AAC .mp4 for each one (same name,
//      new extension), optimized for the web (-movflags +faststart).
//   3. Prints the final files list. You then re-upload each .mp4 to R2 under
//      the same base filename (or edit data/videos.ts to point at the .mp4).
//
// Prerequisites:
//   - ffmpeg on PATH:  https://ffmpeg.org/download.html
//     (Windows: `winget install Gyan.FFmpeg`  or  `choco install ffmpeg`)
//
// Run:
//   node scripts/transcode-r2-videos.mjs
//   node scripts/transcode-r2-videos.mjs --out D:\videos-out   (custom folder)
// -----------------------------------------------------------------------------

import { spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const BASE = "https://pub-9484535a72844cadad6bd50cce517317.r2.dev";

const FILES = [
  "IMG_4452.MOV",
  "IMG_4480.MOV",
  "IMG_4483.MOV",
  "IMG_4515.MOV",
  "IMG_4519.MOV",
  "IMG_4520.MOV",
  "IMG_4521.MOV",
  "IMG_4684.MP4",
  "IMG_4877.MOV",
  "IMG_5088.MOV"
];

// --- CLI ---
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const OUT_DIR = path.resolve(
  outIdx >= 0 && args[outIdx + 1]
    ? args[outIdx + 1]
    : path.join(process.cwd(), "..", "mirrors-transcoded")
);

// --- helpers ---
async function ensureFfmpeg() {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-version"], { shell: process.platform === "win32" });
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok || !r.body) throw new Error(`download failed ${r.status} ${url}`);
  await pipeline(Readable.fromWeb(r.body), fs.createWriteStream(dest));
}

function ffmpegTranscode(inFile, outFile) {
  return new Promise((resolve, reject) => {
    // -crf 22 = visually-lossless quality; -preset veryfast keeps encode time low.
    // -movflags +faststart = web-optimized (metadata at start of file).
    // -vf scale to cap width at 1920 (keeps files small if source is 4K).
    const p = spawn(
      "ffmpeg",
      [
        "-y",
        "-i", inFile,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "22",
        "-vf", "scale='min(1920,iw)':-2",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        outFile
      ],
      { stdio: ["ignore", "inherit", "inherit"], shell: process.platform === "win32" }
    );
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

// --- main ---
try {
  await ensureFfmpeg();
} catch {
  console.error("ffmpeg not found on PATH. Install it first:");
  console.error("  Windows:  winget install Gyan.FFmpeg");
  console.error("  macOS:    brew install ffmpeg");
  console.error("  Linux:    apt install ffmpeg  (or your distro's equivalent)");
  process.exit(1);
}

await fsp.mkdir(OUT_DIR, { recursive: true });
const scratchDir = path.join(OUT_DIR, "_source");
await fsp.mkdir(scratchDir, { recursive: true });

console.log(`\nOutput folder: ${OUT_DIR}\n`);

const produced = [];
for (const name of FILES) {
  const outName = name.replace(/\.(mov|mp4)$/i, ".mp4"); // keep IMG_XXXX.mp4
  const outPath = path.join(OUT_DIR, outName);
  const srcPath = path.join(scratchDir, name);

  if (fs.existsSync(outPath)) {
    console.log(`✓  ${outName}  (already exists, skipping)`);
    produced.push(outName);
    continue;
  }

  console.log(`↓  downloading ${name}`);
  await download(`${BASE}/${name}`, srcPath);

  console.log(`⚙  transcoding → ${outName}`);
  await ffmpegTranscode(srcPath, outPath);

  await fsp.unlink(srcPath).catch(() => {});
  produced.push(outName);
}

// Clean up the scratch source folder.
await fsp.rm(scratchDir, { recursive: true, force: true }).catch(() => {});

console.log(`\nDone. ${produced.length} files ready in:\n  ${OUT_DIR}\n`);
console.log("Next steps:");
console.log("  1. Upload each .mp4 to your R2 bucket (same base name, .mp4 extension).");
console.log("  2. In data/videos.ts, rename each .MOV to .mp4 and set type to 'video/mp4'.");
console.log("     e.g.  file: 'IMG_4452.mp4',  type: 'video/mp4'");
console.log("");
