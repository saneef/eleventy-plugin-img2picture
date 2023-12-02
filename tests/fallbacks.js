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
  const input = '<img src="/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture({
    ...baseConfig,
    formats: ["avif", "webp"],
  });
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});
