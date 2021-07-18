const path = require("path");
const test = require("ava");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));
const imageSize = require("image-size");

const img2picture = require("../img2picture.js");

const sourcePath = path.join(__dirname, "fixtures");
const outputBase = path.join(__dirname, "output", "jpgs");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

test("Optimizes JPG image, puts them in <picture>, and generates AVIF, WebP, JPEG", async (t) => {
  const input =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.html";
  const output =
    '<picture><source type="image/avif" srcset="sunset-by-bruno-scramgnon-96360a92-150w.avif 150w, sunset-by-bruno-scramgnon-96360a92-300w.avif 300w, sunset-by-bruno-scramgnon-96360a92-450w.avif 450w, sunset-by-bruno-scramgnon-96360a92-600w.avif 600w, sunset-by-bruno-scramgnon-96360a92-750w.avif 750w, sunset-by-bruno-scramgnon-96360a92-900w.avif 900w, sunset-by-bruno-scramgnon-96360a92-1050w.avif 1050w, sunset-by-bruno-scramgnon-96360a92-1200w.avif 1200w, sunset-by-bruno-scramgnon-96360a92-1350w.avif 1350w" sizes="100vw">,<source type="image/webp" srcset="sunset-by-bruno-scramgnon-96360a92-150w.webp 150w, sunset-by-bruno-scramgnon-96360a92-300w.webp 300w, sunset-by-bruno-scramgnon-96360a92-450w.webp 450w, sunset-by-bruno-scramgnon-96360a92-600w.webp 600w, sunset-by-bruno-scramgnon-96360a92-750w.webp 750w, sunset-by-bruno-scramgnon-96360a92-900w.webp 900w, sunset-by-bruno-scramgnon-96360a92-1050w.webp 1050w, sunset-by-bruno-scramgnon-96360a92-1200w.webp 1200w, sunset-by-bruno-scramgnon-96360a92-1350w.webp 1350w" sizes="100vw">,<source type="image/jpeg" srcset="sunset-by-bruno-scramgnon-96360a92-150w.jpeg 150w, sunset-by-bruno-scramgnon-96360a92-300w.jpeg 300w, sunset-by-bruno-scramgnon-96360a92-450w.jpeg 450w, sunset-by-bruno-scramgnon-96360a92-600w.jpeg 600w, sunset-by-bruno-scramgnon-96360a92-750w.jpeg 750w, sunset-by-bruno-scramgnon-96360a92-900w.jpeg 900w, sunset-by-bruno-scramgnon-96360a92-1050w.jpeg 1050w, sunset-by-bruno-scramgnon-96360a92-1200w.jpeg 1200w, sunset-by-bruno-scramgnon-96360a92-1350w.jpeg 1350w" sizes="100vw"><img src="sunset-by-bruno-scramgnon-96360a92-150w.jpeg" width="1350" height="893" alt="Sunset" sizes="100vw" loading="lazy" decoding="async"></picture>';

  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);

  const { width: smallestWebPWidth } = imageSize(
    path.join(outputBase, "sunset-by-bruno-scramgnon-96360a92-150w.webp")
  );
  const { width: largestWebPWidth } = imageSize(
    path.join(outputBase, "sunset-by-bruno-scramgnon-96360a92-1350w.webp")
  );

  t.is(smallestWebPWidth, 150);
  t.is(largestWebPWidth, 1350);
});
