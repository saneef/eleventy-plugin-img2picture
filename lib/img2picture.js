// @ts-check
const cheerio = require("cheerio");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const debug = require("debug")("img2picture");

const {
  isUrl,
  isAllowedExtension,
  generateWidths,
  parseStringToNumbers,
  objectToAttributes,
} = require("./helpers.js");

/**
 * @typedef {(id?: string, src?: string, width?: string, format?: string, options?: object) => string} filenameFormatFn
 */

/**
 * @typedef {object} Img2PictureOptions
 * @property {string=} eleventyInputDir
 * @property {string=} imagesOutputDir
 * @property {string=} urlPath
 * @property {Array<string>=} extensions
 * @property {Array<string>=} formats
 * @property {string=} sizes
 * @property {number=} minWidth
 * @property {number=} maxWidth
 * @property {number=} widthStep
 * @property {filenameFormatFn=} filenameFormat
 * @property {boolean=} fetchRemote
 * @property {boolean=} dryRun
 * @property {object=} sharpOptions
 * @property {object=} cacheOptions
 * @property {object=} sharpWebpOptions
 * @property {object=} sharpPngOptions
 * @property {object=} sharpJpegOptions
 * @property {object=} sharpAvifOptions
 */

/** @type {Img2PictureOptions} */
const defaultOptions = {
  eleventyInputDir: ".",
  imagesOutputDir: "_site",
  urlPath: "",
  extensions: ["jpg", "png", "jpeg"],
  formats: ["avif", "webp", "jpeg"],
  sizes: "100vw",
  minWidth: 150,
  maxWidth: 1500,
  widthStep: 150,
  fetchRemote: false,
  dryRun: false,
  cacheOptions: {},
  sharpOptions: {},
  sharpWebpOptions: {},
  sharpPngOptions: {},
  sharpJpegOptions: {},
  sharpAvifOptions: {},
};

/**
 * Remove unnecessary attributes
 *
 * @param      {object}  obj     The object
 * @return     {object}
 */
function cleanAttributes(obj) {
  const cleanedObj = { ...obj };

  delete cleanedObj["data-img2picture-ignore"];
  delete cleanedObj["data-img2picture-widths"];
  delete cleanedObj.src;
  delete cleanedObj.class;
  delete cleanedObj.width;
  delete cleanedObj.height;
  delete cleanedObj.sizes;

  return cleanedObj;
}

/**
 * Default function to generate image filenames
 *
 * @type {filenameFormatFn}
 */
const filenameFormatter = function (id, src, width, format) {
  const extension = path.extname(src);
  const name = path.basename(src, extension);

  return `${name}-${id}-${width}w.${format}`;
};

/**
 *
 * Returns the last (assumed to be most compatible) format metadata
 *
 *
 * @param      {object}  metadata  The metadata
 * @param      {Img2PictureOptions}  options   The options
 * @return     {object}  The the last from metadata
 */
const getFallbackFormat = (metadata, options) => {
  const { formats } = options;
  const fallbackFormat = formats[formats.length - 1];

  return metadata[fallbackFormat];
};

/**
 * Generates `<picture>` element from Image metadata
 *
 * @param      {object}           metadata  The metadata
 * @param      {object}           attrs     The attributes
 * @param      {Img2PictureOptions}   options   The options
 * @return     {string}                     The <picture> element
 */
function generatePicture(metadata, attrs, options) {
  const { sizes } = options;
  const pictureAttrs = {
    class: attrs.class,
  };

  const imgAttrs = {
    ...cleanAttributes(attrs),
    loading: attrs.loading || "lazy",
    decoding: attrs.decoding || "async",
  };

  const fallbackFormat = getFallbackFormat(metadata, options);

  const medsrc = fallbackFormat[Math.floor(fallbackFormat.length / 2)];
  const highsrc = fallbackFormat[fallbackFormat.length - 1];
  return `<picture${objectToAttributes(pictureAttrs)}>${Object.values(metadata)
    .map((imageFormat) => {
      return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map((entry) => entry.srcset)
        .join(", ")}" sizes="${attrs.sizes || sizes}">`;
    })
    .join("")}<img
        src="${medsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        ${objectToAttributes(imgAttrs)}></picture>`;
}

/**
 * Generate responsive image files, and return a `<picture>` element
 * populated with generated file paths and sizes.
 *
 * @param      {Record<string, string>}   attrs    The attributes
 * @param      {Img2PictureOptions}   options  The options
 * @return     {Promise}  { description_of_the_return_value }
 */
async function generateImage(attrs, options) {
  const {
    cacheOptions,
    dryRun,
    eleventyInputDir,
    filenameFormat,
    formats,
    imagesOutputDir,
    maxWidth,
    minWidth,
    sharpAvifOptions,
    sharpJpegOptions,
    sharpOptions,
    sharpPngOptions,
    sharpWebpOptions,
    urlPath,
    widthStep,
  } = options;
  const { src, "data-img2picture-widths": imgAttrWidths } = attrs;

  const widths = imgAttrWidths
    ? parseStringToNumbers(imgAttrWidths)
    : generateWidths(minWidth, maxWidth, widthStep);
  const filePath = isUrl(src) ? src : path.join(eleventyInputDir, src);

  const filenameFormatFn =
    typeof filenameFormat === "function" ? filenameFormat : filenameFormatter;

  // eslint-disable-next-line new-cap
  const metadata = await Image(filePath, {
    formats,
    filenameFormat: filenameFormatFn,
    widths,
    urlPath,
    outputDir: imagesOutputDir,
    sharpOptions,
    sharpWebpOptions,
    sharpPngOptions,
    sharpJpegOptions,
    sharpAvifOptions,
    dryRun,
    cacheOptions,
  });

  return generatePicture(metadata, attrs, options);
}

/**
 * Replaces `<img>` elements with `<picture>`
 * with responsive sizes and formats
 *
 * @param      {string}   content  The content
 * @param      {Img2PictureOptions}   options  The options
 * @return     {Promise<string>}  HTML content with <img> replaced with <picture> elements
 */
async function replaceImages(content, options) {
  const { extensions, fetchRemote } = options;
  const $ = cheerio.load(content);
  let images = $("img")
    .not("picture img") // Ignore images wrapped in <picture>
    .not("[data-img2picture-ignore]") // Ignore excluded images
    .filter((i, el) => {
      const src = $(el).attr("src");
      return isAllowedExtension(src, extensions);
    });

  // Ignore remote images if fetchRemote is false
  if (!fetchRemote) {
    images = images.filter((i, el) => {
      const src = $(el).attr("src");
      return !isUrl(src);
    });
  }

  const promises = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const attrs = $(img).attr();

    debug(`Optimizing: ${attrs.src}`);

    promises[i] = generateImage(attrs, options);
  }

  const pictures = await Promise.all(promises);

  pictures.forEach((picture, i) => {
    $(images[i]).replaceWith(picture);
  });

  return $.html();
}

/**
 * Initialise transformer function
 *
 * @param      {Img2PictureOptions=}  userOptions  The options
 * @return     {(content: string) => Promise<string>}  The transformer function
 */
function img2picture(userOptions) {
  /** @type {Img2PictureOptions} */
  const options = { ...defaultOptions, ...(userOptions || {}) };

  return async function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return replaceImages(content, options);
    }

    return content;
  };
}

module.exports = img2picture;
module.exports.filenameFormatter = filenameFormatter;
