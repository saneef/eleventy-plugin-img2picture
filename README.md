# eleventy-plugin-img2picture

Eleventy plugin to replace `<img>` using `<picture>` with resized and optimized images.

This plugin is inspired by [eleventy-plugin-local-respimg](https://github.com/chromeos/static-site-scaffold-modules/tree/main/modules/eleventy-plugin-local-respimg) by [Sam Richard](https://twitter.com/Snugug/).

## Features

- Drop-in plugin to replace all `<img>` in your website without shortcodes
- [Ignore image using data attribute](#ignore-images)

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
      eleventyInputDir: "", // Eleventy input folder. 🚨 Required
      imagesOutputDir: "_site", // Output folder for optimized images. 🚨 Required
      // URL prefix for images src URLS.
      // It should match with path suffix in `imagesOutputDir`.
      // Eg: imagesOutputDir with `_site/images` likely need urlPath as `/images/`
      urlPath: "", 🚨 Required
      extensions: ["jpg", "png", "jpeg"], // File extensions to optmize
      // Formats to be generated.
      // ⚠️ The <source> tags are ordered based on the order of formats in this array.
      // Keep the most optimised first, and least in the end.
      formats: ["avif", "webp", "jpeg"],
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

### Attributes on `<img>`

- `class` attribute on `<img>` will be moved to `<picture>`.
- `src`, `width`, and `height` attributes will be populated based optimized image size.
- All other attributes on `<img>` will be retained. This let you set custom `sizes`, like `<img src="..." sizes="(min-width: 60em) 75vw, 100vw" alt="..." />`.

Example:

```html
<img
  class="w-full"
  src="shapes.png"
  alt="Shapes"
  data-variant="bleed"
  loading="eager"
  decoding="auto"
/>
```

...will generate:

```html
<picture class="w-full"
  ><source
    type="image/avif"
    srcset="
      shapes-150w.avif   150w,
      shapes-300w.avif   300w,
      shapes-450w.avif   450w,
      shapes-600w.avif   600w,
      shapes-750w.avif   750w,
      shapes-900w.avif   900w,
      shapes-1050w.avif 1050w,
      shapes-1200w.avif 1200w,
      shapes-1350w.avif 1350w
    "
    sizes="100vw" />
  <source
    type="image/webp"
    srcset="
      shapes-150w.webp   150w,
      shapes-300w.webp   300w,
      shapes-450w.webp   450w,
      shapes-600w.webp   600w,
      shapes-750w.webp   750w,
      shapes-900w.webp   900w,
      shapes-1050w.webp 1050w,
      shapes-1200w.webp 1200w,
      shapes-1350w.webp 1350w
    "
    sizes="100vw" />
  <source
    type="image/jpeg"
    srcset="
      shapes-150w.jpeg   150w,
      shapes-300w.jpeg   300w,
      shapes-450w.jpeg   450w,
      shapes-600w.jpeg   600w,
      shapes-750w.jpeg   750w,
      shapes-900w.jpeg   900w,
      shapes-1050w.jpeg 1050w,
      shapes-1200w.jpeg 1200w,
      shapes-1350w.jpeg 1350w
    "
    sizes="100vw" />
  <img
    src="shapes-150w.jpeg"
    width="1350"
    height="1350"
    alt="Shapes"
    data-variant="bleed"
    sizes="100vw"
    loading="eager"
    decoding="auto"
/></picture>
```

## Why is this plugin different from others?

Plugins like [`eleventy-plugin-respimg`](https://www.npmjs.com/package/eleventy-plugin-respimg), and [`eleventy-plugin-images-responsiver`](https://github.com/nhoizey/images-responsiver/tree/main/packages/eleventy-plugin-images-responsiver/) utilizes shortcodes or attributes to optimize images. The `eleventy-plugin-img2picture` doesn't rely on shortcode. It optimizes all `<img>` matching the file extensions. You can exclude `<img>` using data attribute `data-img2picture-ignore`.
