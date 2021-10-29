const path = require("path");
const test = require("ava");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const imageSize = require("image-size");

const img2picture = require("../lib/img2picture.js");

const sourcePath = path.join("tests/fixtures");
const outputBase = path.join("tests/output/pngs");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

const baseOptions = {
  eleventyInputDir: sourcePath,
  imagesOutputDir: outputBase,
  urlPath: "/images/",
};

test("Optimizes PNG image, generates AVIF, WebP, JPEG formats, and puts them in <picture>", async (t) => {
  const input = '<img src="/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";
  const output =
    '<picture><source type="image/avif" srcset="/images/shapes-h6IXxFCRF_-150w.avif 150w, /images/shapes-h6IXxFCRF_-300w.avif 300w, /images/shapes-h6IXxFCRF_-450w.avif 450w, /images/shapes-h6IXxFCRF_-600w.avif 600w, /images/shapes-h6IXxFCRF_-750w.avif 750w, /images/shapes-h6IXxFCRF_-900w.avif 900w, /images/shapes-h6IXxFCRF_-1050w.avif 1050w, /images/shapes-h6IXxFCRF_-1200w.avif 1200w, /images/shapes-h6IXxFCRF_-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="/images/shapes-h6IXxFCRF_-150w.webp 150w, /images/shapes-h6IXxFCRF_-300w.webp 300w, /images/shapes-h6IXxFCRF_-450w.webp 450w, /images/shapes-h6IXxFCRF_-600w.webp 600w, /images/shapes-h6IXxFCRF_-750w.webp 750w, /images/shapes-h6IXxFCRF_-900w.webp 900w, /images/shapes-h6IXxFCRF_-1050w.webp 1050w, /images/shapes-h6IXxFCRF_-1200w.webp 1200w, /images/shapes-h6IXxFCRF_-1350w.webp 1350w" sizes="100vw"><source type="image/jpeg" srcset="/images/shapes-h6IXxFCRF_-150w.jpeg 150w, /images/shapes-h6IXxFCRF_-300w.jpeg 300w, /images/shapes-h6IXxFCRF_-450w.jpeg 450w, /images/shapes-h6IXxFCRF_-600w.jpeg 600w, /images/shapes-h6IXxFCRF_-750w.jpeg 750w, /images/shapes-h6IXxFCRF_-900w.jpeg 900w, /images/shapes-h6IXxFCRF_-1050w.jpeg 1050w, /images/shapes-h6IXxFCRF_-1200w.jpeg 1200w, /images/shapes-h6IXxFCRF_-1350w.jpeg 1350w" sizes="100vw"><img src="/images/shapes-h6IXxFCRF_-750w.jpeg" width="1350" height="1350" alt="Shapes" loading="lazy" decoding="async"></picture>';

  const transformer = img2picture(baseOptions);
  const result = await transformer(input, outputPath);
  t.is(result, output);

  const { width: smallestWebPWidth } = imageSize(
    path.join(outputBase, "shapes-h6IXxFCRF_-150w.webp")
  );
  const { width: largestWebPWidth } = imageSize(
    path.join(outputBase, "shapes-h6IXxFCRF_-1350w.webp")
  );

  t.is(smallestWebPWidth, 150);
  t.is(largestWebPWidth, 1350);
});
