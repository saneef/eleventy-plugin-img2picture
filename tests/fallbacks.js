const path = require("path");
const test = require("ava");

const img2picture = require("../lib/img2picture.js");
const { filenameFormat } = require("./utils.js");

const sourcePath = path.join("tests/fixtures");
const outputBase = path.join("tests/output/fallbacks");

const baseConfig = {
  eleventyInputDir: sourcePath,
  imagesOutputDir: outputBase,
  urlPath: "/images/",
  filenameFormat,
  dryRun: true,
};

test("Fallback to an available format in <img>", async (t) => {
  const input =
    '<img src="/images/shapes.png" alt="Shapes" data-size="full" aria-label="An icon">';
  const outputPath = "file.html";
  const output =
    '<picture><source type="image/avif" srcset="/images/shapes-150w.avif 150w, /images/shapes-300w.avif 300w, /images/shapes-450w.avif 450w, /images/shapes-600w.avif 600w, /images/shapes-750w.avif 750w, /images/shapes-900w.avif 900w, /images/shapes-1050w.avif 1050w, /images/shapes-1200w.avif 1200w, /images/shapes-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="/images/shapes-150w.webp 150w, /images/shapes-300w.webp 300w, /images/shapes-450w.webp 450w, /images/shapes-600w.webp 600w, /images/shapes-750w.webp 750w, /images/shapes-900w.webp 900w, /images/shapes-1050w.webp 1050w, /images/shapes-1200w.webp 1200w, /images/shapes-1350w.webp 1350w" sizes="100vw"><img src="/images/shapes-150w.webp" width="1350" height="1350" alt="Shapes" data-size="full" aria-label="An icon" loading="lazy" decoding="async"></picture>';

  const transformer = img2picture({
    ...baseConfig,
    formats: ["avif", "webp"],
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);
});
