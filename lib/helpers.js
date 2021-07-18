/**
 * Determines whether the specified path is a local path.
 *
 * @param      {string}   path    The path
 * @return     {boolean}  True if the specified path is local path, False otherwise.
 */
function isLocalPath(path) {
  return !/^https?:\/\//.test(path);
}

/**
 * Determines if file extension is allowed.
 *
 * @param      {string}   path        The path
 * @param      {Array<string>}   extensions  The extensions
 * @return     {boolean}  True if allowed extension, False otherwise.
 */
function isAllowedExtension(path, extensions) {
  const lowerCaseExtensions = extensions.map((x) => x.toLowerCase());

  return Boolean(
    lowerCaseExtensions.find((ext) => path.toLowerCase().endsWith(ext))
  );
}

/**
 * Generate Widths for Image
 *
 * @param      {number}  min     The minimum
 * @param      {number}  max     The maximum
 * @param      {number}  step    The step
 * @return     {Array<number>}   Widths
 */
function generateWidths(min, max, step) {
  const sizes = [];
  for (let i = min; i < max; i += step) {
    sizes.push(i);
  }

  return sizes;
}

/**
 * Converts object to HTML attributes string
 *
 * @param      {Object}  obj     The object
 * @return     {string}
 */
function objectToAttributes(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key]) {
      return `${acc} ${key}="${obj[key]}"`;
    }

    return acc;
  }, "");
}

/**
 * Determines if content has <body> tag.
 *
 * @param      {string}   content  The content
 * @return     {boolean}  True if body tag, False otherwise.
 */
function hasBodyTag(content) {
  const hasBody = /<\s*body(\w|\s|=|"|-)*>/gm;
  return hasBody.test(content);
}

module.exports = {
  isLocalPath,
  isAllowedExtension,
  generateWidths,
  objectToAttributes,
  hasBodyTag,
};
