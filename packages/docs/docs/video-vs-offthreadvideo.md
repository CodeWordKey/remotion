---
image: /generated/articles-docs-video-vs-offthreadvideo.png
id: video-vs-offthreadvideo
title: "<Video> vs. <OffthreadVideo>"
crumb: "Comparison"
---

We offer two components for including other videos in your video: [`<Video />`](/docs/video) and [`<OffthreadVideo />`](/docs/offthreadvideo).
This page offers a comparison to help you decide which tag to use.

## [`<Video />`](/docs/video)

Is based on the native HTML5 `<video>` element and therefore behaves similar to it.

**Pros**

✅ &nbsp; You can attach a ref and [draw the video to a canvas](/docs/video-manipulation).  
✅ &nbsp; Can be rendered without having to be downloaded fully (only if you don't need audio and pass `muted`).  
✅ &nbsp; [Renders embedded transparent videos quickly](/docs/transparent-videos).

**Cons**

⛔ &nbsp; Chrome may throttle video tags if the page is heavy.  
⛔ &nbsp; If too many video tags get rendered simultaneously, a timeout may occur.  
⛔ &nbsp; If the input video framerate does not match with the output framerate, some duplicate frames may occur in the output.  
⛔ &nbsp; A Google Chrome build with proprietary codecs is required.

## [`<OffthreadVideo />`](/docs/offthreadvideo)

A more sophisticated way of embedding a video, which:

- renders a `<video>` tag during preview
- displays the exact frame in an [`<Img>`](/docs/img) tag during rendering, that frame gets extracted using FFmpeg outside the browser

**Pros**

✅ &nbsp; More videos can be displayed simulatenously as Chrome will not apply throttling.  
✅ &nbsp; No flickers or duplicate frames in the output video can occur.  
✅ &nbsp; Supports more codecs such as ProRes (only during render-time).  
✅ &nbsp; Is usually faster to render.

**Cons**

⛔ &nbsp; The video needs to be downloaded fully before a frame can be rendered.  
⛔ &nbsp; No ref can be attached to this element, as it is `<video>` during preview but a `<Img/>` during render.  
⛔ &nbsp; The video cannot be drawn to a canvas.  
⛔ &nbsp; Supports embedded transparent videos only if [`transparent`](/docs/offthreadvideo#transparent-) is set which leads to a performance penalty.

Prefer [`<OffthreadVideo />`](/docs/offthreadvideo) whenever possible.
