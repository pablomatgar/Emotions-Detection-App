[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Codacy Badge][codacy-image]][codacy-url]

# Cordova/Capacitor CanvasCamera plugin

## Plugin's Purpose

The purpose of the plugin is to capture video to preview camera in a web page's canvas element.
Allows to select front or back camera and to control the flash.

---
## Table of Contents

1. [Working Demo](#working-demo)
2. [Supported Platforms](#supported-platforms)
3. [Dependencies](#dependencies)
4. [Installation](#installation)
5. [Using the plugin (JavaScript)](#using-the-plugin-javascript)
6. [Using the plugin (TypeScript)](#using-the-plugin-typescript)

---
## Working Demo

### Cordova

* Having trouble using CanvasCamera with Cordova ? [Check our working cordova (javascript) demo here](https://github.com/VirtuoWorks/canvascamera-cordova-demo).

### Capacitor

* Having trouble using CanvasCamera with Capacitor ? [Check our working capacitor (typescript) demo here](https://github.com/VirtuoWorks/canvascamera-capacitor-demo).

---

## Supported Platforms

- iOS
- Android

---
## Dependencies

* [Cordova][cordova] : Cordova dependencies are managed with `plugman`. `plugman` will check all dependencies and install them if they are missing.

* [Capacitor][capacitor] : Capacitor dependencies are managed with `npm`. `npm` will check all dependencies and install them if they are missing.

---
## Installation

### Table of Contents

1. [Installation in a Cordova project](#installation-in-a-cordova-project)
2. [Installation in a Capacitor project](#installation-in-a-capacitor-project)

---
### Installation in a Cordova project
#### Adding the Plugin to your project


Through the [Command-line Interface][cli]:

```bash
cordova plugin add com.virtuoworks.cordova-plugin-canvascamera
# Add the plugin to your platforms (Android and/or iOS)
cordova prepare
```

### Removing the Plugin from your project

Through the [Command-line Interface][cli]:

```bash
cordova plugin remove com.virtuoworks.cordova-plugin-canvascamera
```

---
### Installation in a Capacitor project
#### Adding the Plugin to your project


Through the [Command-line Interface][cli]:

```bash
npm install com.virtuoworks.cordova-plugin-canvascamera
# Build the Angular project using the plugin
npm run build
# Add the plugin to your platforms (Android and/or iOS)
npx cap sync
```

### Removing the Plugin from your project

Through the [Command-line Interface][cli]:

```bash
npm remove com.virtuoworks.cordova-plugin-canvascamera
# Remove the plugin from your platforms (Android and/or iOS)
npx cap sync
```

---

## Using the plugin (JavaScript)

The plugin creates the object `window.plugin.CanvasCamera` with the following methods:

### Plugin initialization

The plugin and its methods are not available before the _deviceready_ event has been fired.
Call `initialize` with a reference to the canvas object used to preview the video and a second, optional, reference to a thumbnail canvas.

```javascript
document.addEventListener(
  'deviceready',
  function () {
    // Call the initialize() function with canvas element reference
    var objCanvas = document.getElementById('canvas');
    window.plugin.CanvasCamera.initialize(objCanvas);
    // window.plugin.CanvasCamera is now available
  },
  false
);
```

### `start`

Start capturing video as images from camera to preview camera on web page.<br>
`capture` callback function will be called with image data (image file url) each time the plugin takes an image for a frame.<br>

```javascript
window.plugin.CanvasCamera.start(options);
```

This function starts a video capturing session, then the plugin takes each frame as a JPEG image and gives its url to web page calling the `capture` callback function with the image url(s).<br>
The `capture` callback function will draw the image inside a canvas element to display the video.

#### Example

```javascript
var options = {
  cameraFacing: 'front',
};
window.plugin.CanvasCamera.start(options);
```

### `flashMode`

Set flash mode for camera.<br>

```javascript
window.plugin.CanvasCamera.flashMode(true);
```

### `cameraPosition`

Change input camera to 'front' or 'back' camera.

```javascript
window.plugin.CanvasCamera.cameraPosition('front');
```

### Options

Optional parameters to customize the settings.

```javascript
{
    width: 352,
    height: 288,
    canvas: {
      width: 352,
      height: 288
    },
    capture: {
      width: 352,
      height: 288
    },
    fps: 30,
    use: 'file',
    flashMode: false,
    thumbnailRatio: 1/6,
    cameraFacing: 'front', // or 'back'
    onBeforeDraw: function(frame){
      // do something before drawing a frame
      // frame.image; // HTMLImageElement
      // frame.element; // HTMLCanvasElement
    },
    onAfterDraw: function(frame){
      // do something after drawing a frame
      // frame.image.src; // file path or base64 data URI
      // frame.element.toDataURL(); // requested base64 data URI
    }
}

```

- `width` : **Number**, optional, default : `352`, width in pixels of the video to capture **and** the output canvas width in pixels.
- `height` : **Number**, optional, default : `288`, height in pixels of the video to capture **and** the output canvas height in pixels.

- `capture.width` : **Number**, optional, default : `352`, width in pixels of the video to capture.
- `capture.height` : **Number**, optional, default : `288`, height in pixels of the video to capture.

- `canvas.width` : **Number**, optional, default : `352`, output canvas width in pixels.
- `canvas.height` : **Number**, optional, default : `288`, output canvas height in pixels.

- `fps` : **Number**, optional, default : `30`, desired number of frames per second.
- `cameraFacing` : **String**, optional, default : `'front'`, `'front'` or `'back'`.
- `flashMode` : **Boolean**, optional, default : `false`, a boolean to set flash mode on/off.
- `thumbnailRatio` : **Number**, optional, default : `1/6`, a ratio used to scale down the thumbnail.

- `use` : **String**, optional, default : `file`, `file` to use files for rendering (lower CPU / higher storage) or `data` to use base64 jpg data for rendering (higher cpu / lower storage).

- `onBeforeDraw` : **Function**, optional, default : `null`, callback executed before a frame has been drawn. `frame` contains the canvas element, the image element, the tracking data, ...
- `onAfterDraw` : **Function**, optional, default : `null`, callback executed after a frame has been drawn. `frame` contains the canvas element, the image element, the tracking data, ...

## Usage

### Full size video only

```javascript
let fullsizeCanvasElement = document.getElementById('fullsize-canvas');

CanvasCamera.initialize(fullsizeCanvasElement);

let options: CanvasCamera.CanvasCameraOptions = {
  cameraFacing: 'back',
  onAfterDraw: function (frame) {
    // do something with each frame
    // frame.image.src; // file path or base64 data URI
    // frame.element.toDataURL(); // requested base64 data URI
  },
};

CanvasCamera.start(options);
```

### With thumbnail video

```javascript
let fullsizeCanvasElement = document.getElementById('fullsize-canvas');
let thumbnailCanvasElement = document.getElementById('thumbnail-canvas');

CanvasCamera.initialize(fullsizeCanvasElement, thumbnailCanvasElement);

let options: CanvasCamera.CanvasCameraOptions = {
  cameraFacing: 'front',
  fps: 15,
  thumbnailRatio: 1 / 6,
  onAfterDraw: function (frame) {
    // do something with each frame of the fullsize canvas element only
    // frame.image.src; // file path or base64 data URI
    // frame.element.toDataURL(); // requested base64 data URI
  },
};

CanvasCamera.start(options);
```
---
## Using the plugin (TypeScript)
### TypeScript/Angular &ge; 2 support

#### CanvasCamera plugin &ge;`1.2.1` (current, typescript version)

The plugin was entirely re-written in typescript and the type definition file `CanvasCamera.d.ts` included in the plugin.

For exemple, in your typescript file :

```typescript
import { CanvasCameraUserOptions } from 'com.virtuoworks.cordova-plugin-canvascamera';
```

To import the type for the options object.
#### CanvasCamera plugin &le;`1.2.0` (prior to typescript version)

The CanvasCamera `1.2.0` plugin type definition has been added to the DefinitelyTyped repository (see commit [here](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/7f7f502db804112161ef06e712275591d8c4a835)) thanks to a benevolent [contributor](https://github.com/VirtuoWorks/CanvasCameraPlugin/issues/8).

If you wish to install the type definition file :

```bash
npm install --save @types/cordova-plugin-canvascamera
```

You can check this [NPM](https://www.npmjs.com/package/@types/cordova-plugin-canvascamera) page for more informations about this type definition.


The plugin creates the object `window.plugin.CanvasCamera` with the following methods:


### Important :

This TypeScript documentation is intended for CanvasCamera &ge;`1.2.1` with the provided `CanvasCamera.d.ts`.

The CanvasCamera &ge;`1.2.1` plugin might not be compatible with the definitely typed CanvasCamera type definition.

The plugin creates a global `CanvasCamera` variable. Importing any type from `com.virtuoworks.cordova-plugin-canvascamera` augments the `global` namespace with this new variable.

__No need to import CanvasCamera type from the plugin to use its implementation__.

From now on, we assume that we are in an Angular component

### Plugin options

Optional parameters to customize the settings.

```typescript
import { Component, AfterViewInit } from '@angular/core';
import {
    CanvasCameraUserOptions,
    CanvasCameraUseImageAs,
    CanvasCameraCameraFacing,
    CanvasCameraFrame
} from 'com.virtuoworks.cordova-plugin-canvascamera';

// ...
export class SomeAngularComponent implements AfterViewInit {

  // ...

  private use: CanvasCameraUseImageAs = 'file';
  private position: CanvasCameraCameraFacing = 'back';

  private options: CanvasCameraUserOptions = {
    width: 320,
    height: 240,
    canvas: {
      width: 320,
      height: 240,
    },
    capture: {
      width: 320,
      height: 240,
    },
    use: use,
    fps: 30,
    flashMode: this.flash,
    hasThumbnail: true,
    thumbnailRatio: 1 / 6,
    cameraFacing: this.position,
    onBeforeDraw: <CanvasCameraFrame>(frame) => {
      // do something before drawing a frame
      // frame.image; // HTMLImageElement
      // frame.element; // HTMLCanvasElement
    },
    onAfterDraw: <CanvasCameraFrame>(frame) =>{
      // do something after drawing a frame
      // frame.image.src; // file path or base64 data URI
      // frame.element.toDataURL(); // requested base64 data URI
    }
  };

  //...

}
```

- `width` : **Number**, optional, default : `352`, width in pixels of the video to capture **and** the output canvas width in pixels.
- `height` : **Number**, optional, default : `288`, height in pixels of the video to capture **and** the output canvas height in pixels.

- `capture.width` : **Number**, optional, default : `352`, width in pixels of the video to capture.
- `capture.height` : **Number**, optional, default : `288`, height in pixels of the video to capture.

- `canvas.width` : **Number**, optional, default : `352`, output canvas width in pixels.
- `canvas.height` : **Number**, optional, default : `288`, output canvas height in pixels.

- `fps` : **Number**, optional, default : `30`, desired number of frames per second.
- `cameraFacing` : **String**, optional, default : `'front'`, `'front'` or `'back'`.
- `flashMode` : **Boolean**, optional, default : `false`, a boolean to set flash mode on/off.
- `thumbnailRatio` : **Number**, optional, default : `1/6`, a ratio used to scale down the thumbnail.

- `use` : **String**, optional, default : `file`, `file` to use files for rendering (lower CPU / higher storage) or `data` to use base64 jpg data for rendering (higher cpu / lower storage).

- `onBeforeDraw` : **Function**, optional, default : `null`, callback executed before a frame has been drawn. `frame` contains the canvas element, the image element, the tracking data, ...
- `onAfterDraw` : **Function**, optional, default : `null`, callback executed after a frame has been drawn. `frame` contains the canvas element, the image element, ...

### Plugin initialization

Call `initialize` with a reference to the canvas object used to preview the video and a second, _optional_, referencing a thumbnail canvas.

```typescript
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {
    CanvasCameraUserOptions,
    CanvasCameraUseImageAs,
    CanvasCameraCameraFacing,
    CanvasCameraFrame
} from 'com.virtuoworks.cordova-plugin-canvascamera';

// ...
export class SomeAngularComponent implements AfterViewInit {

  // ...

  // Referencing a template HTMLCanvasElement (<canvas #fullsize/>)
  @ViewChild('fullsize') fullsizeCanvas: ElementRef;
  // (Optional) Referencing a template HTMLCanvasElement (<canvas #thumbnail/>)
  @ViewChild('thumbnail') thumbnailCanvas: ElementRef;

  ngAfterViewInit() {
    CanvasCamera.initialize({
      fullsize: this.fullsizeCanvas.nativeElement,
      thumbnail: this.thumbnailCanvas.nativeElement, // optional
    });
  }

  // ...

}
```

### `start`

Start capturing video as images from camera to preview camera on web page.<br>
`capture` callback function will be called with image data (image file url) each time the plugin takes an image for a frame.<br>

```typescript
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {
    CanvasCameraUserOptions,
    CanvasCameraUseImageAs,
    CanvasCameraCameraFacing,
    CanvasCameraFrame
} from 'com.virtuoworks.cordova-plugin-canvascamera';

// ...
export class SomeAngularComponent implements AfterViewInit {

  private options: CanvasCameraUserOptions = {}

  // ...

  start() {
    if (CanvasCamera) {
      CanvasCamera.start(
        this.options,
        (error) => {
          console.log('[CanvasCamera start]', 'error', error);
        },
        (data) => {
          console.log('[CanvasCamera start]', 'data', data);
        }
      );
    }
  }

  // ...

}
```

This function starts a video capturing session, then the plugin takes each frame as a JPEG image and gives its url to web page calling the `capture` callback function with the image url(s).<br>
The `capture` callback function will draw the image inside a canvas element to display the video.

### `flashMode`

Set flash mode for camera.

```typescript
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {
    CanvasCameraUserOptions,
    CanvasCameraUseImageAs,
    CanvasCameraCameraFacing,
    CanvasCameraFrame
} from 'com.virtuoworks.cordova-plugin-canvascamera';

// ...
export class SomeAngularComponent implements AfterViewInit {

  private flash = true;

  // ...

  flashMode() {
    if (CanvasCamera) {
      CanvasCamera.flashMode(
        this.flash,
        (error) => {
          console.log('[CanvasCamera start]', 'error', error);
        },
        (data) => {
          console.log('[CanvasCamera start]', 'data', data);
        }
      );
    }
  }

  // ...

}
```
### `cameraPosition`

Change input camera to `'front'` or `'back'` camera.

```typescript
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {
    CanvasCameraUserOptions,
    CanvasCameraUseImageAs,
    CanvasCameraCameraFacing,
    CanvasCameraFrame
} from 'com.virtuoworks.cordova-plugin-canvascamera';

// ...
export class SomeAngularComponent implements AfterViewInit {

  private position: CanvasCameraCameraFacing = 'back';

  // ...

  cameraPosition() {
    if (CanvasCamera) {
      CanvasCamera.cameraPosition(
        this.position,
        (error) => {
          console.log('[CanvasCamera cameraPosition]', error);
        },
        (data: CanvasCameraData) => {
          console.log('[CanvasCamera cameraPosition]', 'data', data);
        }
      );
    }
  }

  // ...

}
```

---

## Contributing

1. Fork it
2. Install development dependencies with `npm i`
3. Create your feature branch (`git checkout -b my-new-feature`)
4. `src/browser/src/CanvasCamera.ts` is the source typescript file
5. `npm run build` or `npm run watch` to build a new `www/CanvasCamera.js` output file
6. Commit your changes (`git commit -am 'Added some feature'`)
7. Push to the branch (`git push origin my-new-feature`)
8. Create new Pull Request

## License

This software is released under the [MIT License][mit-license].

[cordova]: https://cordova.apache.org
[capacitor]: https://capacitorjs.com/
[cli]: http://cordova.apache.org/docs/en/latest/guide/cli/index.html
[mit-license]: https://opensource.org/licenses/MIT
[npm-image]: https://img.shields.io/npm/v/com.virtuoworks.cordova-plugin-canvascamera.svg
[npm-url]: https://www.npmjs.com/package/com.virtuoworks.cordova-plugin-canvascamera
[downloads-image]: https://img.shields.io/npm/dm/com.virtuoworks.cordova-plugin-canvascamera.svg
[downloads-url]: https://www.npmjs.com/package/com.virtuoworks.cordova-plugin-canvascamera
[codacy-image]: https://app.codacy.com/project/badge/Grade/d2f08eb3f8e545bbbe253c0e4212b309
[codacy-url]: https://www.codacy.com/gh/VirtuoWorks/CanvasCameraPlugin/dashboard?utm_source=github.com&utm_medium=referral&utm_content=VirtuoWorks/CanvasCameraPlugin&utm_campaign=Badge_Grade
