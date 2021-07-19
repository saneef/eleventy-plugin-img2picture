const path = require("path");
const test = require("ava");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const imageSize = require("image-size");

const img2picture = require("../lib/img2picture.js");
const { filenameFormat } = require("./utils.js");

const sourcePath = path.join(__dirname, "fixtures");
const outputBase = path.join(__dirname, "output", "jpgs");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

test("Optimizes JPG image, puts them in <picture>, and generates AVIF, WebP, JPEG", async (t) => {
  const input =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.html";
  const output =
    '<picture><source type="image/avif" srcset="/images/sunset-by-bruno-scramgnon-150w.avif 150w, /images/sunset-by-bruno-scramgnon-300w.avif 300w, /images/sunset-by-bruno-scramgnon-450w.avif 450w, /images/sunset-by-bruno-scramgnon-600w.avif 600w, /images/sunset-by-bruno-scramgnon-750w.avif 750w, /images/sunset-by-bruno-scramgnon-900w.avif 900w, /images/sunset-by-bruno-scramgnon-1050w.avif 1050w, /images/sunset-by-bruno-scramgnon-1200w.avif 1200w, /images/sunset-by-bruno-scramgnon-1350w.avif 1350w" sizes="100vw"><source type="image/webp" srcset="/images/sunset-by-bruno-scramgnon-150w.webp 150w, /images/sunset-by-bruno-scramgnon-300w.webp 300w, /images/sunset-by-bruno-scramgnon-450w.webp 450w, /images/sunset-by-bruno-scramgnon-600w.webp 600w, /images/sunset-by-bruno-scramgnon-750w.webp 750w, /images/sunset-by-bruno-scramgnon-900w.webp 900w, /images/sunset-by-bruno-scramgnon-1050w.webp 1050w, /images/sunset-by-bruno-scramgnon-1200w.webp 1200w, /images/sunset-by-bruno-scramgnon-1350w.webp 1350w" sizes="100vw"><source type="image/jpeg" srcset="/images/sunset-by-bruno-scramgnon-150w.jpeg 150w, /images/sunset-by-bruno-scramgnon-300w.jpeg 300w, /images/sunset-by-bruno-scramgnon-450w.jpeg 450w, /images/sunset-by-bruno-scramgnon-600w.jpeg 600w, /images/sunset-by-bruno-scramgnon-750w.jpeg 750w, /images/sunset-by-bruno-scramgnon-900w.jpeg 900w, /images/sunset-by-bruno-scramgnon-1050w.jpeg 1050w, /images/sunset-by-bruno-scramgnon-1200w.jpeg 1200w, /images/sunset-by-bruno-scramgnon-1350w.jpeg 1350w" sizes="100vw"><img src="/images/sunset-by-bruno-scramgnon-150w.jpeg" width="1350" height="893" alt="Sunset" sizes="100vw" loading="lazy" decoding="async"></picture>';

  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
    urlPath: "/images/",
    filenameFormat,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);

  const { width: smallestWebPWidth } = imageSize(
    path.join(outputBase, "sunset-by-bruno-scramgnon-150w.webp")
  );
  const { width: largestWebPWidth } = imageSize(
    path.join(outputBase, "sunset-by-bruno-scramgnon-1350w.webp")
  );

  t.is(smallestWebPWidth, 150);
  t.is(largestWebPWidth, 1350);
});
