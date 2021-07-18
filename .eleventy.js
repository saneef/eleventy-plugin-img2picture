const img2picture = require("img2picture");

/** @typedef { import('./img2picture').Img2PictureOptions } Img2PictureOptions */

module.exports = {
  /**
   * Plugin config function
   *
   * @param      {Object}  eleventy     The eleventy configuration object
   * @param      {Img2PictureOptions=}       The options
   */
  configFunction(eleventy, options) {
    eleventy.addTransform("img2picture", img2picture(options));
  },
};
