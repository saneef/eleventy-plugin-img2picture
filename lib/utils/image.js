// @ts-check

/**
 * Generate Widths for Image
 *
 * @param {number} min The minimum
 * @param {number} max The maximum
 * @param {number} step The step
 * @returns {number[]} Widths
 */
function generateWidths(min, max, step) {
  const sizes = [];
  for (let i = min; i < max; i += step) {
    sizes.push(i);
  }

  return sizes;
}

module.exports = {
  generateWidths,
};
