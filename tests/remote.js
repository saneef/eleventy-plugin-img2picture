const path = require("path");
const test = require("ava");
const { rimraf } = require("rimraf");
const imageSize = require("image-size");

const img2picture = require("../lib/img2picture.js");
const { filenameFormat } = require("./utils.js");

const sourcePath = path.join("tests/fixtures");
const outputBase = path.join("tests/output/remote");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

const baseOptions = {
  eleventyInputDir: sourcePath,
  imagesOutputDir: outputBase,
  urlPath: "/images/",
  filenameFormat,
  fetchRemote: true,
  cacheOptions: {
    directory: path.join(outputBase, ".cache"),
  },
};

test("Fetch a remote image, generates AVIF, WebP, JPEG formats, and puts them in <picture>", async (t) => {
  const input =
    '<img src="https://raw.githubusercontent.com/saneef/eleventy-plugin-img2picture/main/tests/fixtures/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture({
    ...baseOptions,
    fetchRemote: true,
  });
  const result = await transformer(input, outputPath);
  t.snapshot(result);

  const { width: smallestWebPWidth } = imageSize(
    path.join(outputBase, "shapes-150w.webp"),
  );
  const { width: largestWebPWidth } = imageSize(
    path.join(outputBase, "shapes-1350w.webp"),
  );

  t.is(smallestWebPWidth, 150);
  t.is(largestWebPWidth, 1350);
});

test("Fetch a remote image with query params in URL", async (t) => {
  const input =
    '<img src="https://raw.githubusercontent.com/saneef/eleventy-plugin-img2picture/main/tests/fixtures/images/shapes.png?v=12345" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture({
    ...baseOptions,
    fetchRemote: true,
  });
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});
