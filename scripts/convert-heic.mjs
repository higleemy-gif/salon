import fs from "node:fs/promises";
import path from "node:path";
import convert from "heic-convert";

const SRC = path.resolve("Images");
const OUT = path.resolve("public/interior");

await fs.mkdir(OUT, { recursive: true });

const files = (await fs.readdir(SRC)).filter((f) => /\.heic$/i.test(f));
if (!files.length) {
  console.log("No HEIC files found in", SRC);
  process.exit(0);
}

for (const f of files) {
  const inPath = path.join(SRC, f);
  const outName = f.replace(/\.heic$/i, ".jpg").toLowerCase();
  const outPath = path.join(OUT, outName);
  const buf = await fs.readFile(inPath);
  const jpg = await convert({ buffer: buf, format: "JPEG", quality: 0.9 });
  await fs.writeFile(outPath, Buffer.from(jpg));
  console.log("→", outName, `(${(jpg.byteLength / 1024).toFixed(0)} KB)`);
}
console.log("Done.");
