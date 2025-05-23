---
image: /generated/articles-docs-renderer-get-compositions.png
title: getCompositions()
id: get-compositions
crumb: "@remotion/renderer"
---

import {AngleChangelog} from '../../components/AngleChangelog';

_Part of the `@remotion/renderer` package._

Gets a list of compositions defined in a Remotion project based on a [Remotion Bundle](/docs/terminology/bundle) by evaluating the [Remotion Root](/docs/terminology/remotion-root).

For every compositions their [`calculateMetadata()`](/docs/composition#calculatemetadata) function is evaluated. If you just want to evaluate one composition that you want to render, use [`selectComposition()`](/docs/renderer/select-composition).

```ts
const getCompositions: (
  bundleOrServeUrl: string,
  options?: GetCompositionsConfig,
) => Promise<TComposition[]>;
```

## Arguments

### `bundleOrServeUrl`

A string pointing to a [Remotion Bundle](/docs/terminology/bundle) generated by [`bundle()`](/docs/bundle) or a URL that hosts the the bundled Remotion project.

### `options?`

_optional_

An object containing one or more of the following options:

#### `inputProps?`

_optional_

Define custom props that can be retrieved using [`getInputProps()`](/docs/get-input-props) at runtime. Useful for [setting a dynamic duration or dimensions](/docs/dynamic-metadata) for your video.

#### `puppeteerInstance?`<AvailableFrom v="3.0.0" />

_optional_

An already open Puppeteer [`Browser`](/docs/renderer/open-browser) instance. Use [`openBrowser()`](/docs/renderer/open-browser) to create a new instance. Reusing a browser across multiple function calls can speed up the rendering process. You are responsible for opening and closing the browser yourself. If you don't specify this option, a new browser will be opened and closed at the end.

#### `browserExecutable?`<AvailableFrom v="2.3.1" />

A string defining the absolute path on disk of the browser executable that should be used. By default Remotion will try to detect it automatically and download one if none is available. If `puppeteerInstance` is defined, it will take precedence over `browserExecutable`.

#### `onBrowserLog?`<AvailableFrom v="3.0.0" />

_optional_

Gets called when your project calls `console.log` or another method from console. A browser log has three properties:

- `text`: The message being printed
- `stackTrace`: An array of objects containing the following properties:
  - `url`: URL of the resource that logged.
  - `lineNumber`: 0-based line number in the file where the log got called.
  - `columnNumber`: 0-based column number in the file where the log got called.
- `type`: The console method - one of `log`, `debug`, `info`, `error`, `warning`, `dir`, `dirxml`, `table`, `trace`, `clear`, `startGroup`, `startGroupCollapsed`, `endGroup`, `assert`, `profile`, `profileEnd`, `count`, `timeEnd`, `verbose`

```tsx twoslash
interface ConsoleMessageLocation {
  /**
   * URL of the resource if known or `undefined` otherwise.
   */
  url?: string;
  /**
   * 0-based line number in the resource if known or `undefined` otherwise.
   */
  lineNumber?: number;
  /**
   * 0-based column number in the resource if known or `undefined` otherwise.
   */
  columnNumber?: number;
}

type BrowserLog = {
  text: string;
  stackTrace: ConsoleMessageLocation[];
  type:
    | "log"
    | "debug"
    | "info"
    | "error"
    | "warning"
    | "dir"
    | "dirxml"
    | "table"
    | "trace"
    | "clear"
    | "startGroup"
    | "startGroupCollapsed"
    | "endGroup"
    | "assert"
    | "profile"
    | "profileEnd"
    | "count"
    | "timeEnd"
    | "verbose";
};

const getCompositions = (options: {
  onBrowserLog?: (log: BrowserLog) => void;
}) => {};
// ---cut---
getCompositions({
  // ...
  onBrowserLog: (info) => {
    console.log(`${info.type}: ${info.text}`);
    console.log(
      info.stackTrace
        .map((stack) => {
          return `  ${stack.url}:${stack.lineNumber}:${stack.columnNumber}`;
        })
        .join("\n"),
    );
  },
});
```

#### `timeoutInMilliseconds?`<AvailableFrom v="2.6.3" />

A number describing how long one frame may take to resolve all [`delayRender()`](/docs/delay-render) calls before the [render times out and fails(/docs/timeout). Default: `30000`

#### `port?`

Prefer a specific port that will be used to serve the Remotion project. If not specified, a random port will be used.

#### `logLevel?`<AvailableFrom v="4.0.0"/>

<Options id="log"/>

#### `chromiumOptions?`<AvailableFrom v="2.6.5" />

_optional_

Allows you to set certain Chromium / Google Chrome flags. See: [Chromium flags](/docs/chromium-flags).

### `offthreadVideoCacheSizeInBytes?`<AvailableFrom v="4.0.23"/>

<Options id="offthreadvideo-cache-size-in-bytes" />

### `binariesDirectory?`<AvailableFrom v="4.0.120" />

<Options id="binaries-directory" />

### ~~`ffmpegExecutable`~~

_removed in v4.0, optional_

An absolute path overriding the `ffmpeg` executable to use.

### ~~`ffprobeExecutable?`~~ <AvailableFrom v="3.0.17" />

_removed in v4.0_

An absolute path overriding the `ffprobe` executable to use.

## Return value

Returns a promise that resolves to an array of available compositions. Example value:

```ts twoslash
[
  {
    id: "HelloWorld",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 120,
    defaultProps: {
      title: "Hello World",
    },
  },
  {
    id: "Title",
    width: 1080,
    height: 1080,
    fps: 30,
    durationInFrames: 90,
    defaultProps: undefined,
  },
];
```

The `defaultProps` only get returned since v2.5.7.

## See also

- [Source code for this function](https://github.com/remotion-dev/remotion/blob/main/packages/renderer/src/get-compositions.ts)
- [Server-Side rendering](/docs/ssr)
- [`bundle()`](/docs/bundle)
- [`renderMedia()`](/docs/renderer/render-media)
- [`selectComposition()`](/docs/renderer/select-composition)
