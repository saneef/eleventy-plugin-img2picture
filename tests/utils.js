const path = require("path");
function filenameFormat(id, src, width, format) {
  const extension = path.extname(src);
  const name = path.basename(src, extension);

  return `${name}-${width}w.${format}`;
}

module.exports = {
  filenameFormat,
};
