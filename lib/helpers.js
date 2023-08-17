// @ts-check

/**
 * Determines whether the specified string is an HTTP(S) URL.
 *
 * @param      {string}   str    The string
 * @return     {boolean}  `True` if the specified path is an URL.
 */
function isUrl(str) {
  return /^https?:\/\//.test(str);
}

/**
 * Checks if the file path matches a whitelist of extensions
 *
 * @param      {string}          path        The path
 * @param      {Array<string>}   extensions  The extensions
 * @return     {boolean}         `True` if matches, `False` otherwise.
 */
function isAllowedExtension(path, extensions) {
  const lowerCaseExtensions = extensions.map((x) => x.toLowerCase());

  return Boolean(
    lowerCaseExtensions.find((ext) => path.toLowerCase().endsWith(ext)),
  );
}

/**
 * Parse string with comma separated numbers into array of numbers
 *
 * @param      {string}  str     The string to parse
 * @return     {Array<number>}   An array of numbers
 */
function parseStringToNumbers(str) {
  return str.split(",").map((s) => Number(s));
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
 * Removes object properties.
 *
 * @param      {Object}  obj     The object
 * @param      {Array<string>}  props   The properties
 * @return     {<type>}  { description_of_the_return_value }
 */
function removeObjectProperties(obj, props = []) {
  const copy = { ...obj };

  props.forEach((key) => delete copy[key]);

  return copy;
}

module.exports = {
  isUrl,
  isAllowedExtension,
  parseStringToNumbers,
  generateWidths,
  objectToAttributes,
  removeObjectProperties,
};
