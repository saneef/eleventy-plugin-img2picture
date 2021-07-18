const path = require("path");
const test = require("ava");
const { promisify } = require("util");
const rimraf = promisify(require("rimraf"));

const img2picture = require("../img2picture.js");

const sourcePath = path.join(__dirname, "fixtures");
const outputBase = path.join(__dirname, "output", "jpg");
const filenameFormat = function (id, src, width, format) {
  const extension = path.extname(src);
  const name = path.basename(src, extension);
  return `${name}-${width}.${format}`;
};

test.before("Cleanup Output Images", async () => rimraf(outputBase));
test.after.always("Cleanup Output Images", async () => rimraf(outputBase));

test("Optimizes JPEGs, puts them in <picture>, generates AVIF, WebP, JPEG", async (t) => {
  const input =
    '<img src="/images/sunset-by-bruno-scramgnon.jpg" alt="Sunset">';
  const outputPath = "file.html";
  const output =
    '<picture><source type="image/avif" srcset="sunset-by-bruno-scramgnon-150.avif 150w, sunset-by-bruno-scramgnon-300.avif 300w, sunset-by-bruno-scramgnon-450.avif 450w, sunset-by-bruno-scramgnon-600.avif 600w, sunset-by-bruno-scramgnon-750.avif 750w, sunset-by-bruno-scramgnon-900.avif 900w, sunset-by-bruno-scramgnon-1050.avif 1050w, sunset-by-bruno-scramgnon-1200.avif 1200w, sunset-by-bruno-scramgnon-1350.avif 1350w" sizes="100vw">,<source type="image/webp" srcset="sunset-by-bruno-scramgnon-150.webp 150w, sunset-by-bruno-scramgnon-300.webp 300w, sunset-by-bruno-scramgnon-450.webp 450w, sunset-by-bruno-scramgnon-600.webp 600w, sunset-by-bruno-scramgnon-750.webp 750w, sunset-by-bruno-scramgnon-900.webp 900w, sunset-by-bruno-scramgnon-1050.webp 1050w, sunset-by-bruno-scramgnon-1200.webp 1200w, sunset-by-bruno-scramgnon-1350.webp 1350w" sizes="100vw">,<source type="image/jpeg" srcset="sunset-by-bruno-scramgnon-150.jpeg 150w, sunset-by-bruno-scramgnon-300.jpeg 300w, sunset-by-bruno-scramgnon-450.jpeg 450w, sunset-by-bruno-scramgnon-600.jpeg 600w, sunset-by-bruno-scramgnon-750.jpeg 750w, sunset-by-bruno-scramgnon-900.jpeg 900w, sunset-by-bruno-scramgnon-1050.jpeg 1050w, sunset-by-bruno-scramgnon-1200.jpeg 1200w, sunset-by-bruno-scramgnon-1350.jpeg 1350w" sizes="100vw"><img src="sunset-by-bruno-scramgnon-150.jpeg" width="1350" height="893" alt="Sunset" sizes="100vw" loading="lazy" decoding="async"></picture>';

  const transformer = img2picture({
    input: sourcePath,
    output: outputBase,
    filenameFormat,
  });
  const result = await transformer.bind({ outputPath })(input);
  t.is(result, output);
});
