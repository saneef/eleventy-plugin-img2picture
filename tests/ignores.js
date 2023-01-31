const path = require("path");
const test = require("ava");
const rimraf = require("rimraf");

const img2picture = require("../lib/img2picture.js");

const sourcePath = path.join(__dirname, "fixtures");
const outputBase = path.join(__dirname, "output", "ignores");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

test("Don't optimize image in a file other than HTML", async (t) => {
  const input =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.xml";
  const output =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';

  const transformer = img2picture({
    eleventyInputDir: sourcePath,
    imagesOutputDir: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Don't optimize <img> tag with data-img2picture-ignore", async (t) => {
  const input =
    '<img data-img2picture-ignore="true" src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><img data-img2picture-ignore="true" src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset"></body></html>';
  const transformer = img2picture({
    eleventyInputDir: sourcePath,
    imagesOutputDir: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Don't optimize SVG", async (t) => {
  const input = '<img src="/images/nothing.svg" alt="Nothing">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><img src="/images/nothing.svg" alt="Nothing"></body></html>';
  const transformer = img2picture({
    eleventyInputDir: sourcePath,
    imagesOutputDir: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Don't optimize GIF", async (t) => {
  const input = '<img src="/images/nothing.gif" alt="Nothing">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><img src="/images/nothing.gif" alt="Nothing"></body></html>';
  const transformer = img2picture({
    eleventyInputDir: sourcePath,
    imagesOutputDir: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);
});

test("Don't fetch and optimize a remote image", async (t) => {
  const input =
    '<img src="https://github.com/saneef/eleventy-plugin-img2picture/raw/main/tests/fixtures/images/shapes.png" alt="Shapes">';
  const outputPath = "file.html";
  const output =
    '<html><head></head><body><img src="https://github.com/saneef/eleventy-plugin-img2picture/raw/main/tests/fixtures/images/shapes.png" alt="Shapes"></body></html>';

  const transformer = img2picture({
    eleventyInputDir: sourcePath,
    imagesOutputDir: outputBase,
  });
  const result = await transformer(input, outputPath);
  t.is(result, output);
});
