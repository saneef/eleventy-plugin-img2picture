const path = require("path");
const test = require("ava");
const { rimraf } = require("rimraf");
const imageSize = require("image-size");
const { existsSync } = require("node:fs");

const img2picture = require("../lib/img2picture.js");
const { filenameFormat } = require("./utils.js");

const sourcePath = path.join("tests/fixtures");
const outputBase = path.join("tests/output/svgs");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

const baseOptions = {
  eleventyInputDir: sourcePath,
  imagesOutputDir: outputBase,
  urlPath: "/images/",
  filenameFormat,
  formats: ["avif", "webp", "svg", "jpeg"],
};

test("Optimizes SVG image, generates AVIF, WebP, SVG, JPEG formats, and puts them in <picture>", async (t) => {
  const input =
    '<img src="/images/Ghostscript_Tiger.svg" alt="Ghostscript Tiger">';
  const outputPath = "file.html";
  const imagesOutputDir = path.join(outputBase, "default");
  const transformer = img2picture({
    ...baseOptions,
    imagesOutputDir,
    svgCompressionSize: "br",
  });
  const result = await transformer(input, outputPath);
  t.snapshot(result);

  const svgFilePath = path.join(imagesOutputDir, "Ghostscript_Tiger-900w.svg");
  t.true(existsSync(svgFilePath));

  const { width: smallestImgWidth } = imageSize(
    path.join(imagesOutputDir, "Ghostscript_Tiger-150w.jpeg"),
  );
  const { width: largestImgWidth } = imageSize(
    path.join(imagesOutputDir, "Ghostscript_Tiger-1350w.jpeg"),
  );

  t.is(smallestImgWidth, 150);
  t.is(largestImgWidth, 1350);
});

test("Optimizes SVG image to other formats when `svgShortCircuit: false`", async (t) => {
  const input =
    '<img src="/images/Ghostscript_Tiger.svg" alt="Ghostscript Tiger">';
  const outputPath = "file.html";

  const transformer = img2picture({
    ...baseOptions,
    svgShortCircuit: false,
    imagesOutputDir: path.join(outputBase, "svgShortCircuit-false"),
  });
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Process SVG image and skip to other formats when `svgShortCircuit: true`", async (t) => {
  const input =
    '<img src="/images/Ghostscript_Tiger.svg" alt="Ghostscript Tiger">';
  const outputPath = "file.html";

  const transformer = img2picture({
    ...baseOptions,
    svgShortCircuit: true,
    imagesOutputDir: path.join(outputBase, "svgShortCircuit-true"),
  });
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});
