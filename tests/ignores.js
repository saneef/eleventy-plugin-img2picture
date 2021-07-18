const path = require("path");
const test = require("ava");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));

const img2picture = require("../img2picture.js");

const sourcePath = path.join(__dirname, "fixtures");
const outputBase = path.join(__dirname, "output", "ignores");

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

test("Don't optimise in non-HTML files", async (t) => {
  const input =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.xml";
  const output =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';

  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
  });
  const result = await transformer.bind({ outputPath })(input);
  t.is(result, output);
});

test("Don't optimise <img> tag with data-img2picture-ignore", async (t) => {
  const input =
    '<img data-img2picture-ignore="true" src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.html";
  const output =
    '<img data-img2picture-ignore="true" src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
  });
  const result = await transformer.bind({ outputPath })(input);
  t.is(result, output);
});

test("Don't optimise SVG", async (t) => {
  const input = '<img src="/images/nothing.svg" alt="Nothing">';
  const outputPath = "file.html";
  const output = '<img src="/images/nothing.svg" alt="Nothing">';
  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
  });
  const result = await transformer.bind({ outputPath })(input);
  t.is(result, output);
});

test("Don't optimise GIF", async (t) => {
  const input = '<img src="/images/nothing.gif" alt="Nothing">';
  const outputPath = "file.html";
  const output = '<img src="/images/nothing.gif" alt="Nothing">';
  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
  });
  const result = await transformer.bind({ outputPath })(input);
  t.is(result, output);
});
