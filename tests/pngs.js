const path = require("path");
const test = require("ava");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const imageSize = require("image-size");

const img2picture = require("../lib/img2picture.js");

const sourcePath = path.join(__dirname, "fixtures");
const outputBase = path.join(__dirname, "output", "pngs");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

test("Optimizes PNG image, puts them in <picture>, and generates AVIF, WebP, JPEG", async (t) => {
  const input = '<img src="/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";
  const output =
    '<picture><source type="image/avif" srcset="shapes-f4474c14-150w.avif 150w, shapes-f4474c14-300w.avif 300w, shapes-f4474c14-450w.avif 450w, shapes-f4474c14-600w.avif 600w, shapes-f4474c14-750w.avif 750w, shapes-f4474c14-900w.avif 900w, shapes-f4474c14-1050w.avif 1050w, shapes-f4474c14-1200w.avif 1200w, shapes-f4474c14-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="shapes-f4474c14-150w.webp 150w, shapes-f4474c14-300w.webp 300w, shapes-f4474c14-450w.webp 450w, shapes-f4474c14-600w.webp 600w, shapes-f4474c14-750w.webp 750w, shapes-f4474c14-900w.webp 900w, shapes-f4474c14-1050w.webp 1050w, shapes-f4474c14-1200w.webp 1200w, shapes-f4474c14-1350w.webp 1350w" sizes="100vw"><source type="image/jpeg" srcset="shapes-f4474c14-150w.jpeg 150w, shapes-f4474c14-300w.jpeg 300w, shapes-f4474c14-450w.jpeg 450w, shapes-f4474c14-600w.jpeg 600w, shapes-f4474c14-750w.jpeg 750w, shapes-f4474c14-900w.jpeg 900w, shapes-f4474c14-1050w.jpeg 1050w, shapes-f4474c14-1200w.jpeg 1200w, shapes-f4474c14-1350w.jpeg 1350w" sizes="100vw"><img src="shapes-f4474c14-150w.jpeg" width="1350" height="1350" alt="Shapes" sizes="100vw" loading="lazy" decoding="async"></picture>';

  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);

  const { width: smallestWebPWidth } = imageSize(
    path.join(outputBase, "shapes-f4474c14-150w.webp")
  );
  const { width: largestWebPWidth } = imageSize(
    path.join(outputBase, "shapes-f4474c14-1350w.webp")
  );

  t.is(smallestWebPWidth, 150);
  t.is(largestWebPWidth, 1350);
});
