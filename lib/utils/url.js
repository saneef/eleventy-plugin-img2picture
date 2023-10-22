// @ts-check

/**
 * Determines whether the specified string is an HTTP(S) URL.
 *
 * @param      {string}   url    The string
 * @return     {boolean}  `True` if the specified path is an URL.
 *
 * Code from https://github.com/11ty/eleventy-img/blob/a2eb5d0e0e4cf3ce2dd330a7ac09ece676bfb7cd/img.js
 */
function isRemoteUrl(url) {
  try {
    const validUrl = new URL(url);

    if (
      validUrl.protocol.startsWith("https:") ||
      validUrl.protocol.startsWith("http:")
    ) {
      return true;
    }

    return false;
  } catch {
    // Invalid url OR local path
    return false;
  }
}

function getPathFromUrl(url) {
  try {
    const validUrl = new URL(url);
    return validUrl.pathname;
  } catch {}
}

module.exports = {
  isRemoteUrl,
  getPathFromUrl,
};
