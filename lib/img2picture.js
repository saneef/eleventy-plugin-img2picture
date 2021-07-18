// @ts-check
const cheerio = require("cheerio");
const Image = require("@11ty/eleventy-img");
const path = require("path");

const {
  isLocalPath,
  isAllowedExtension,
  generateWidths,
  objectToAttributes,
  hasBodyTag,
} = require("./helpers.js");

/**
 * @typedef {(id: string, src: string, width: string, format: string, options: object) => string} filenameFormatFn
 */

/**
 * @typedef {Object} Img2PictureOptions
 * @property {string=} input
 * @property {string=} output
 * @property {string=} urlPath
 * @property {Array<string>=} extensions
 * @property {Array<string>=} formats
 * @property {string=} sizes
 * @property {number=} minWidth
 * @property {number=} maxWidth
 * @property {number=} widthStep
 * @property {filenameFormatFn=} filenameFormat
 * @property {Object=} sharpOptions
 * @property {Object=} sharpWebpOptions
 * @property {Object=} sharpPngOptions
 * @property {Object=} sharpJpegOptions
 * @property {Object=} sharpAvifOptions
 */

/** @type {Img2PictureOptions} */
const defaultOptions = {
  input: "",
  output: "_site",
  urlPath: "",
  extensions: ["jpg", "png", "jpeg"],
  formats: ["avif", "webp", "jpeg"],
  sizes: "100vw",
  minWidth: 150,
  maxWidth: 1500,
  widthStep: 150,
  sharpOptions: {},
  sharpWebpOptions: {},
  sharpPngOptions: {},
  sharpJpegOptions: {},
  sharpAvifOptions: {},
};

/**
 * Remove attributes which are unnecessary
 *
 * @param      {Object}  obj     The object
 * @return     {Object}
 */
function cleanAttributes(obj) {
  const cleanedObj = { ...obj };

  delete cleanedObj["data-img2picture-ignore"];
  delete cleanedObj.src;
  delete cleanedObj.class;
  delete cleanedObj.width;
  delete cleanedObj.height;

  return cleanedObj;
}

/**
 * Generate image filename
 *
 * @param      {string}  id      The identifier
 * @param      {string}  src     The source
 * @param      {string}  width   The width
 * @param      {string}  format  The format
 * @return     {string}          The filename
 */
function filenameFormatter(id, src, width, format) {
  const extension = path.extname(src);
  const name = path.basename(src, extension);

  return `${name}-${id}-${width}w.${format}`;
}

/**
 * Generates <picture> elements from Image metadata
 *
 * @param      {Object}           metadata  The metadata
 * @param      {Object}           attrs     The attributes
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
    sizes: attrs.sizes || sizes,
    loading: attrs.loading || "lazy",
    decoding: attrs.decoding || "async",
  };

  const lowsrc = metadata.jpeg[0];
  const highsrc = metadata.jpeg[metadata.jpeg.length - 1];
  return `<picture${objectToAttributes(pictureAttrs)}>${Object.values(metadata)
    .map((imageFormat) => {
      return `<source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map((entry) => entry.srcset)
        .join(", ")}" sizes="${sizes}">`;
    })
    .join("")}<img
        src="${lowsrc.url}"
        width="${highsrc.width}"
        height="${highsrc.height}"
        ${objectToAttributes(imgAttrs)}></picture>`;
}

/**
 * Generate responsive image files returns corresponding <picture> element
 *
 * @param      {Record<string, string>}   attrs    The attributes
 * @param      {Img2PictureOptions}   options  The options
 * @return     {Promise}  { description_of_the_return_value }
 */
async function generateImage(attrs, options) {
  const {
    input,
    output,
    formats,
    urlPath,
    minWidth,
    maxWidth,
    widthStep,
    filenameFormat,
    sharpOptions,
    sharpWebpOptions,
    sharpPngOptions,
    sharpJpegOptions,
    sharpAvifOptions,
  } = options;
  const widths = generateWidths(minWidth, maxWidth, widthStep);

  const { src } = attrs;
  const filePath = path.join(input, src);

  // eslint-disable-next-line new-cap
  const metadata = await Image(filePath, {
    formats,
    filenameFormat: filenameFormat || filenameFormatter,
    widths,
    urlPath,
    outputDir: output,
    sharpOptions,
    sharpWebpOptions,
    sharpPngOptions,
    sharpJpegOptions,
    sharpAvifOptions,
  });

  return generatePicture(metadata, attrs, options);
}

/**
 * Replaces local path <img> tags using <picture>
 * with different sizes and formats
 *
 * @param      {string}   content  The content
 * @param      {Img2PictureOptions}   options  The options
 * @return     {Promise<string>}  HTML content with <img> replaced with <picture> elements
 */
async function replaceImages(content, options) {
  const { extensions } = options;
  const $ = cheerio.load(content);
  const images = $("img")
    .not("picture img") // Ignore images wrapped in <picture>
    .not("[data-img2picture-ignore]") // Ignore excluded images
    .filter((i, el) => {
      const src = $(el).attr("src");
      return isLocalPath(src) && isAllowedExtension(src, extensions);
    });

  const promises = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const attrs = $(img).attr();
    promises[i] = generateImage(attrs, options);
  }

  const pictures = await Promise.all(promises);

  pictures.forEach((picture, i) => {
    $(images[i]).replaceWith(picture);
  });

  return hasBodyTag(content) ? $.html() : $("body").html();
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
