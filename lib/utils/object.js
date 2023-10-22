// @ts-check

/**
 * Converts object to HTML attributes string
 *
 * @param      {object}  obj     The object
 * @return     {string}
 */
function objectToAttributes(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    // Ignore empty class attribute
    if (key === "class" && !obj[key]) return acc;

    return `${acc} ${key}="${obj[key]}"`;
  }, "");
}

/**
 * Removes object properties.
 *
 * @param      {object}  obj     The object
 * @param      {Array<string>}  props   The properties
 * @return     {object} Shallow cloned object without properties
 */
function removeObjectProperties(obj, props = []) {
  const copy = { ...obj };

  props.forEach((key) => delete copy[key]);

  return copy;
}

module.exports = {
  objectToAttributes,
  removeObjectProperties,
};
