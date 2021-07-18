# eleventy-plugin-img2picture

Eleventy plugin to replace `<img>` using `<picture>` with resized and optimized images.

This plugin is inspired by [eleventy-plugin-local-respimg](https://github.com/chromeos/static-site-scaffold-modules/tree/main/modules/eleventy-plugin-local-respimg) by [Sam Richard](https://twitter.com/Snugug/).

## Supported Image Formats

This plugin uses [`eleventy-img`](https://www.11ty.dev/docs/plugins/image/) to optimize, and generate different sizes and formats of images. All [formats supported](https://www.11ty.dev/docs/plugins/image/#output-formats) by `eleventy-img` are supported by `eleventy-plugin-img2picture`.

## Usage

```js
const img2picture = require("eleventy-plugin-img2picture");

module.exports = function (eleventyConfig) {
  // 👋 It's recommended to use the plugin only on production builds.
  // The plugin works fine on development. Just that, your Eleventy builds will be quite slow.
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addPlugin(img2picture, {
      input: "src", // Eleventy input folder. default: ""
      output: "_site/images", // Output folder for optimized images. default: "_site"
      // URL prefix for images src URLS. default: "".
      // It should match with path suffix in `output`.
      urlPath: "/images/",
      extensions: ["jpg", "png", "jpeg"], // File extensions to optmize
      formats: ["avif", "webp", "jpeg"], // Formats to be generated
      sizes: "100vw", // Default image `sizes` attribute
      minWidth: 150, // Minimum width to resize an image to
      maxWidth: 1500, // Maximum width to resize an image to
      widthStep: 150, // Width difference between each resized image
      // Function used by eleventy-img to generate image filenames
      filenameFormat: function (id, src, width, format) {
        const extension = path.extname(src);
        const name = path.basename(src, extension);

        return `${name}-${id}-${width}w.${format}`;
      },

      // Extra options to pass to the Sharp constructor
      sharpOptions: {},
      sharpWebpOptions: {},
      sharpPngOptions: {},
      sharpJpegOptions: {},
      sharpAvifOptions: {},
    });
  }
};
```

### Ignore Images

Images with `data-img2picture-ignore="true"` or `data-img2picture-ignore` will be ignored by the plugin.

```html
<img
  data-img2picture-ignore="true"
  src="/images/sunset-by-bruno-scramgnon.jpg"
  alt="Sunset"
/>
```

## Why is this plugin different from others?

Plugins like [`eleventy-plugin-respimg`](https://www.npmjs.com/package/eleventy-plugin-respimg), and [`eleventy-plugin-images-responsiver`](https://github.com/nhoizey/images-responsiver/tree/main/packages/eleventy-plugin-images-responsiver/) utilizes shortcodes or attributes to optimize images. The `eleventy-plugin-img2picture` doesn't rely on shortcode. It optimizes all `<img>` matching the file extensions. You can exclude `<img>` using data attribute `data-img2picture-ignore`.
