const path = require("path");
const test = require("ava");
const { rimraf } = require("rimraf");
const imageSize = require("image-size");

const img2picture = require("../lib/img2picture.js");
const { filenameFormat } = require("./utils.js");

const sourcePath = path.join("tests/fixtures");
const outputBase = path.join("tests/output/jpgs");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

const baseOptions = {
  eleventyInputDir: sourcePath,
  imagesOutputDir: outputBase,
  urlPath: "/images/",
  filenameFormat,
};

test("Optimizes JPG image, generates AVIF, WebP, JPEG formats, and puts them in <picture>", async (t) => {
  const input =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.html";

  const transformer = img2picture(baseOptions);
  const result = await transformer(input, outputPath);
  t.snapshot(result);

  const { width: smallestWebPWidth } = imageSize(
    path.join(outputBase, "sunset-by-bruno-scramgnon-150w.webp"),
  );
  const { width: largestWebPWidth } = imageSize(
    path.join(outputBase, "sunset-by-bruno-scramgnon-1350w.webp"),
  );

  t.is(smallestWebPWidth, 150);
  t.is(largestWebPWidth, 1350);
});
