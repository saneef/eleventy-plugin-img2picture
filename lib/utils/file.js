// @ts-check

/**
 * Checks if the file path matches a whitelist of extensions
 *
 * @param {string} path The path
 * @param {string[]} extensions The extensions
 * @returns {boolean} `True` if matches, `False` otherwise.
 */
function isAllowedExtension(path, extensions) {
  const lowerCaseExtensions = extensions.map((x) => x.toLowerCase());

  return Boolean(
    lowerCaseExtensions.find((ext) => path.toLowerCase().endsWith(ext)),
  );
}

module.exports = {
  isAllowedExtension,
};
