# eleventy-plugin-img2picture

Eleventy plugin to replace `<img>` using `<picture>` with resized and optimized images.

This plugin is inspired by [eleventy-plugin-local-respimg](https://github.com/chromeos/static-site-scaffold-modules/tree/main/modules/eleventy-plugin-local-respimg) by [Sam Richard](https://twitter.com/Snugug/).

Requires Node 12+

## Features

- Drop-in plugin to replace all `<img>` in your website without shortcodes.
- [Ignore image using data attribute](#ignore-images).
- Download, cache, and optimize [remote images](#remote-images).

## Supported Image Formats

This plugin uses [`eleventy-img`](https://www.11ty.dev/docs/plugins/image/) to optimize, and generate different sizes and formats of images. All [formats supported](https://www.11ty.dev/docs/plugins/image/#output-formats) by `eleventy-img` are supported by `eleventy-plugin-img2picture`.

## Usage

### Basic Usage

```js
const img2picture = require("eleventy-plugin-img2picture");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(img2picture, {
    // Should be same as Eleventy input folder set using `dir.input`.
    eleventyInputDir: ".",

    // Output folder for optimized images.
    imagesOutputDir: "_site",

    // URL prefix for images src URLS.
    // It should match with path suffix in `imagesOutputDir`.
    // Eg: imagesOutputDir with `_site/images` likely need urlPath as `/images/`
    urlPath: "",
  });
};
```

### Recommended Usage

👋 It's recommended to use the plugin only on production builds (E.g.: `$ ELEVENTY_ENV=production eleventy`). The plugin works fine with [basic usage](#basic-usage). Just that, your Eleventy builds will be quite slow.

```js
module.exports = function (eleventyConfig) {
  if (process.env.ELEVENTY_ENV === "production") {
    eleventyConfig.addPlugin(img2picture, {
      // Should be same as Eleventy input folder set using `dir.input`.
      eleventyInputDir: ".",

      // Output folder for optimized images.
      imagesOutputDir: "_site",

      // URL prefix for images src URLS.
      // It should match with path suffix in `imagesOutputDir`.
      // Eg: imagesOutputDir with `_site/images` likely need urlPath as `/images/`
      urlPath: "",
    });
  } else {
    // During development, copy the files to Eleventy's `dir.output`
    eleventyConfig.addPassthroughCopy("./images");
  }
};
```

### Options

| Name             | Type       | Default                                                                                                                                             | Description                                                                                                                                                                                                                                       |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| eleventyInputDir | `string`   |                                                                                                                                                     | 🚨 Required<br><br>Eleventy input directory. Should be same as Eleventy’s `dir.input`.                                                                                                                                                            |
| imagesOutputDir  | `string`   |                                                                                                                                                     | 🚨 Required<br><br>Output folder for optimized images.                                                                                                                                                                                            |
| urlPath          | `string`   |                                                                                                                                                     | 🚨 Required<br><br>URL prefix for images src URLS. It should match with path suffix in `imagesOutputDir`. Eg: imagesOutputDir with `_site/images` likely need urlPath as `/images/`                                                               |
| extensions       | `array`    | `["jpg", "png", "jpeg"]`                                                                                                                            | File extensions to optmize.                                                                                                                                                                                                                       |
| formats          | `array`    | `["avif", "webp", "jpeg"]`                                                                                                                          | Formats to be generated.<br><br>⚠️ The <source> tags are ordered based on the order of formats in this array. Keep most compatible format at the end. The path of the last format will be populated in the 'src' attribute of fallback <img> tag. |
| sizes            | `string`   | `"100vw"`                                                                                                                                           | Default image `sizes` attribute                                                                                                                                                                                                                   |
| minWidth         | `number`   | `150`                                                                                                                                               | Minimum image width to be generated                                                                                                                                                                                                               |
| maxWidth         | `number`   | `1500`                                                                                                                                              | Maximum image width to be generated                                                                                                                                                                                                               |
| widthStep        | `number`   | `150`                                                                                                                                               | Width increments between each generated image                                                                                                                                                                                                     |
| fetchRemote      | `boolean`  | `false`                                                                                                                                             | Fetch, cache, and optimize remote images.                                                                                                                                                                                                         |
| dryRun           | `boolean`  | `false`                                                                                                                                             | Don't generate image files. Only HTML tags are generated.                                                                                                                                                                                         |
| filenameFormat   | `function` | [`filenameFormatter()`](https://github.com/saneef/eleventy-plugin-img2picture/blob/b56ff9c3785700e68e37f2a1ed1a9ea12744ad73/lib/img2picture.js#L85) | Function used by [`eleventy-img`](https://www.11ty.dev/docs/plugins/image/) to generate image filenames.                                                                                                                                          |
| cacheOptions     | `object`   | `{}`                                                                                                                                                | Cache options passed to [`eleventy-cache-assets`](https://www.11ty.dev/docs/plugins/cache/).                                                                                                                                                      |
| sharpOptions     | `object`   | `{}`                                                                                                                                                | Options passed to [Sharp constructor](https://sharp.pixelplumbing.com/api-constructor#parameters).                                                                                                                                                |
| sharpWebpOptions | `object`   | `{}`                                                                                                                                                | Options passed to [Sharp image format converter] for webp(https://sharp.pixelplumbing.com/api-output#webp).                                                                                                                                       |
| sharpPngOptions  | `object`   | `{}`                                                                                                                                                | Options passed to [Sharp image format converter for png](https://sharp.pixelplumbing.com/api-output#png).                                                                                                                                         |
| sharpJpegOptions | `object`   | `{}`                                                                                                                                                | Options passed to [Sharp image format converter for jpeg](https://sharp.pixelplumbing.com/api-output#jpeg).                                                                                                                                       |
| sharpAvifOptions | `object`   | `{}`                                                                                                                                                | Options passed to [Sharp image format converter for avif](https://sharp.pixelplumbing.com/api-output#avif).                                                                                                                                       |

### Remote images

Set `fetchRemote: true` in options to download, cache, and optimize remote images. `fetchRemote` is `false` by default. Use [`cacheOptions` passed to `eleventy-cache-assets`](https://www.11ty.dev/docs/plugins/cache/#options) to change cache settings like, cache duration, and path.

### Attributes on `<img>`

- `class` attribute on `<img>` will be moved to `<picture>`.
- `sizes` will be hoisted on `<source>` elements.
- `src`, `width`, and `height` attributes will be replaced with corresponding values based on the optimized image.
- All other attributes on `<img>` will be retained.

#### Ignore Images

Images with `data-img2picture-ignore="true"` or `data-img2picture-ignore` will be ignored by the plugin.

```html
<img
  data-img2picture-ignore="true"
  src="/images/sunset-by-bruno-scramgnon.jpg"
  alt="Sunset"
/>
```

#### Specify widths on `<img>`

You can provide a comma separated list of widths using `data-img2picture-widths`. This will override default widths computed from config (`minWidth`, `maxWidth`, and `widthStep`) for a particular `<img>`.

```html
<img
  data-img2picture-widths="200,400,600,800"
  src="/images/sunset-by-bruno-scramgnon.jpg"
  alt="Sunset"
/>
```

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
