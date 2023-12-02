const img2picture = require("./lib/img2picture.js");

/** @typedef {import("./lib/img2picture").Img2PictureOptions} Img2PictureOptions */

module.exports = {
  /**
   * Plugin config function
   *
   * @param {object} eleventy The eleventy configuration object
   * @param {Img2PictureOptions} [The] Options
   */
  configFunction(eleventy, options) {
    eleventy.addTransform("img2picture", img2picture(options));
  },
};
