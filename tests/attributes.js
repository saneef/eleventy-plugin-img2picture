const path = require("path");
const test = require("ava");

const img2picture = require("../lib/img2picture.js");
const { filenameFormat } = require("./utils.js");

const sourcePath = path.join("tests/fixtures");
const outputBase = path.join("tests/output/attributes");

const baseConfig = {
  eleventyInputDir: sourcePath,
  imagesOutputDir: outputBase,
  urlPath: "/images/",
  filenameFormat,
  dryRun: true,
};

test("Hoist 'class' from <img> on <picture>", async (t) => {
  const input = '<img class="w-full" src="/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><picture class="w-full"><source type="image/avif" srcset="/images/shapes-150w.avif 150w, /images/shapes-300w.avif 300w, /images/shapes-450w.avif 450w, /images/shapes-600w.avif 600w, /images/shapes-750w.avif 750w, /images/shapes-900w.avif 900w, /images/shapes-1050w.avif 1050w, /images/shapes-1200w.avif 1200w, /images/shapes-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="/images/shapes-150w.webp 150w, /images/shapes-300w.webp 300w, /images/shapes-450w.webp 450w, /images/shapes-600w.webp 600w, /images/shapes-750w.webp 750w, /images/shapes-900w.webp 900w, /images/shapes-1050w.webp 1050w, /images/shapes-1200w.webp 1200w, /images/shapes-1350w.webp 1350w" sizes="100vw"><source type="image/jpeg" srcset="/images/shapes-150w.jpeg 150w, /images/shapes-300w.jpeg 300w, /images/shapes-450w.jpeg 450w, /images/shapes-600w.jpeg 600w, /images/shapes-750w.jpeg 750w, /images/shapes-900w.jpeg 900w, /images/shapes-1050w.jpeg 1050w, /images/shapes-1200w.jpeg 1200w, /images/shapes-1350w.jpeg 1350w" sizes="100vw"><img src="/images/shapes-750w.jpeg" width="1350" height="1350" alt="Shapes" loading="lazy" decoding="async"></picture></body></html>';

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Hoist 'sizes' attribute from <img> on <source>", async (t) => {
  const input =
    '<img src="/images/shapes.png" sizes="(min-width: 60em) 75vw, 100vw" alt="Shapes">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><picture><source type="image/avif" srcset="/images/shapes-150w.avif 150w, /images/shapes-300w.avif 300w, /images/shapes-450w.avif 450w, /images/shapes-600w.avif 600w, /images/shapes-750w.avif 750w, /images/shapes-900w.avif 900w, /images/shapes-1050w.avif 1050w, /images/shapes-1200w.avif 1200w, /images/shapes-1350w.avif 1350w" sizes="(min-width: 60em) 75vw, 100vw"><source type="image/webp" srcset="/images/shapes-150w.webp 150w, /images/shapes-300w.webp 300w, /images/shapes-450w.webp 450w, /images/shapes-600w.webp 600w, /images/shapes-750w.webp 750w, /images/shapes-900w.webp 900w, /images/shapes-1050w.webp 1050w, /images/shapes-1200w.webp 1200w, /images/shapes-1350w.webp 1350w" sizes="(min-width: 60em) 75vw, 100vw"><source type="image/jpeg" srcset="/images/shapes-150w.jpeg 150w, /images/shapes-300w.jpeg 300w, /images/shapes-450w.jpeg 450w, /images/shapes-600w.jpeg 600w, /images/shapes-750w.jpeg 750w, /images/shapes-900w.jpeg 900w, /images/shapes-1050w.jpeg 1050w, /images/shapes-1200w.jpeg 1200w, /images/shapes-1350w.jpeg 1350w" sizes="(min-width: 60em) 75vw, 100vw"><img src="/images/shapes-750w.jpeg" width="1350" height="1350" alt="Shapes" loading="lazy" decoding="async"></picture></body></html>';

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Retain loading and decoding attributes on <img>", async (t) => {
  const input =
    '<img src="/images/shapes.png" loading="eager" decoding="auto" alt="Shapes">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><picture><source type="image/avif" srcset="/images/shapes-150w.avif 150w, /images/shapes-300w.avif 300w, /images/shapes-450w.avif 450w, /images/shapes-600w.avif 600w, /images/shapes-750w.avif 750w, /images/shapes-900w.avif 900w, /images/shapes-1050w.avif 1050w, /images/shapes-1200w.avif 1200w, /images/shapes-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="/images/shapes-150w.webp 150w, /images/shapes-300w.webp 300w, /images/shapes-450w.webp 450w, /images/shapes-600w.webp 600w, /images/shapes-750w.webp 750w, /images/shapes-900w.webp 900w, /images/shapes-1050w.webp 1050w, /images/shapes-1200w.webp 1200w, /images/shapes-1350w.webp 1350w" sizes="100vw"><source type="image/jpeg" srcset="/images/shapes-150w.jpeg 150w, /images/shapes-300w.jpeg 300w, /images/shapes-450w.jpeg 450w, /images/shapes-600w.jpeg 600w, /images/shapes-750w.jpeg 750w, /images/shapes-900w.jpeg 900w, /images/shapes-1050w.jpeg 1050w, /images/shapes-1200w.jpeg 1200w, /images/shapes-1350w.jpeg 1350w" sizes="100vw"><img src="/images/shapes-750w.jpeg" width="1350" height="1350" loading="eager" decoding="auto" alt="Shapes"></picture></body></html>';

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Retain all data attributes on <img>", async (t) => {
  const input =
    '<img src="/images/shapes.png" alt="Shapes" data-size="full" aria-label="An icon">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><picture><source type="image/avif" srcset="/images/shapes-150w.avif 150w, /images/shapes-300w.avif 300w, /images/shapes-450w.avif 450w, /images/shapes-600w.avif 600w, /images/shapes-750w.avif 750w, /images/shapes-900w.avif 900w, /images/shapes-1050w.avif 1050w, /images/shapes-1200w.avif 1200w, /images/shapes-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="/images/shapes-150w.webp 150w, /images/shapes-300w.webp 300w, /images/shapes-450w.webp 450w, /images/shapes-600w.webp 600w, /images/shapes-750w.webp 750w, /images/shapes-900w.webp 900w, /images/shapes-1050w.webp 1050w, /images/shapes-1200w.webp 1200w, /images/shapes-1350w.webp 1350w" sizes="100vw"><source type="image/jpeg" srcset="/images/shapes-150w.jpeg 150w, /images/shapes-300w.jpeg 300w, /images/shapes-450w.jpeg 450w, /images/shapes-600w.jpeg 600w, /images/shapes-750w.jpeg 750w, /images/shapes-900w.jpeg 900w, /images/shapes-1050w.jpeg 1050w, /images/shapes-1200w.jpeg 1200w, /images/shapes-1350w.jpeg 1350w" sizes="100vw"><img src="/images/shapes-750w.jpeg" width="1350" height="1350" alt="Shapes" data-size="full" aria-label="An icon" loading="lazy" decoding="async"></picture></body></html>';

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Generate image sizes based on data-img2picture-widths", async (t) => {
  const input =
    '<img src="/images/shapes.png" alt="Shapes" data-img2picture-widths="100,150,200,250,300">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><picture><source type="image/avif" srcset="/images/shapes-100w.avif 100w, /images/shapes-150w.avif 150w, /images/shapes-200w.avif 200w, /images/shapes-250w.avif 250w, /images/shapes-300w.avif 300w" sizes="100vw"><source type="image/webp" srcset="/images/shapes-100w.webp 100w, /images/shapes-150w.webp 150w, /images/shapes-200w.webp 200w, /images/shapes-250w.webp 250w, /images/shapes-300w.webp 300w" sizes="100vw"><source type="image/jpeg" srcset="/images/shapes-100w.jpeg 100w, /images/shapes-150w.jpeg 150w, /images/shapes-200w.jpeg 200w, /images/shapes-250w.jpeg 250w, /images/shapes-300w.jpeg 300w" sizes="100vw"><img src="/images/shapes-200w.jpeg" width="300" height="300" alt="Shapes" loading="lazy" decoding="async"></picture></body></html>';

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.is(result, output);
});
