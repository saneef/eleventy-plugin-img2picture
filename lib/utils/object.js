// @ts-check
const { escapeAttribute } = require("entities/lib/escape.js");

/**
 * Converts object to HTML attributes string
 *
 * @param {object} obj The object
 * @returns {string}
 */
function objectToHTMLAttributes(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    // Ignore empty class attribute
    let value = obj[key];
    if (key === "class" && !value) return acc;

    if (key === "alt") {
      value = escapeAttribute(value);
    }

    return `${acc} ${key}="${value}"`;
  }, "");
}

/**
 * Removes object properties.
 *
 * @param {object} obj The object
 * @param {string[]} props The properties
 * @returns {object} Shallow cloned object without properties
 */
function removeObjectProperties(obj, props = []) {
  const copy = { ...obj };

  props.forEach((key) => delete copy[key]);

  return copy;
}

module.exports = {
  objectToHTMLAttributes,
  removeObjectProperties,
};
