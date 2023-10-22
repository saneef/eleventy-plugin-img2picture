// @ts-check

/**
 * Parse string with comma separated numbers into array of numbers
 *
 * @param      {string}  str     The string to parse
 * @return     {Array<number>}   An array of numbers
 */
function parseStringToNumbers(str) {
  return str.split(",").map((s) => Number(s));
}

module.exports = {
  parseStringToNumbers,
};
