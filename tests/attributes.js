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

test('Retain alt=""', async (t) => {
  const input = '<img src="/images/shapes.png" alt="">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test('Add alt="", if missing', async (t) => {
  const input = '<img src="/images/shapes.png">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Don't hoist 'class' from <img> on <picture> when 'hoistImgClass=false", async (t) => {
  const input = '<img class="w-full" src="/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Hoist 'class' from <img> on <picture> when 'hoistImgClass=true", async (t) => {
  const config = { ...baseConfig, hoistImgClass: true };
  const input = '<img class="w-full" src="/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture(config);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Hoist 'sizes' attribute from <img> on <source>", async (t) => {
  const input =
    '<img src="/images/shapes.png" sizes="(min-width: 60em) 75vw, 100vw" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Retain loading and decoding attributes on <img>", async (t) => {
  const input =
    '<img src="/images/shapes.png" loading="eager" decoding="auto" alt="Shapes">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Retain all data attributes on <img>", async (t) => {
  const input =
    '<img src="/images/shapes.png" alt="Shapes" data-size="full" aria-label="An icon">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Generate image sizes based on data-img2picture-widths", async (t) => {
  const input =
    '<img src="/images/shapes.png" alt="Shapes" data-img2picture-widths="100,150,200,250,300">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Populate <picture> class from data-img2picture-picture-class", async (t) => {
  const input =
    '<img src="/images/shapes.png" alt="Shapes" data-img2picture-picture-class="w-full">';
  const outputPath = "file.html";

  const transformer = img2picture(baseConfig);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});

test("Populate <picture> class from data-img2picture-picture-class when 'hoistImgClass=true", async (t) => {
  const config = { ...baseConfig, hoistImgClass: true };
  const input =
    '<img class="img" src="/images/shapes.png" alt="Shapes" data-img2picture-picture-class="w-full">';
  const outputPath = "file.html";

  const transformer = img2picture(config);
  const result = await transformer(input, outputPath);
  t.snapshot(result);
});
