# image zip downloader

This userscript lets you download entire galleries or all images of a forum post for those hosters:

| hoster       | gallery support | forum support |
|--------------| ---- | --- |
| acidimg.co   | ❌ | ✔️ |
 | ibb.co       | ❌| ✔️ |
| imagebam.com | ✔️ | ✔️ |
| imgbox.com   | ✔️ | ✔️ |
| imx.to       | ❌| ✔️ |
| pixhost.to   | ✔️| ✔️ |
| vpir.im |❌ | ✔️ |

## forum support

by default forum support is disabled. To enable support for a forum, after installing the userscript,
add a line to the userscript headers:

```ecma script level 4
// @match        *://*.some-forum.com/*
```

You should now see a button labeled IZD:Download below each supported image-post

## gallery support

When you load a supported gallery, a dark bar with the option to download the gallery as zip appears on the bottom of the screen.

### how to enter pixhost gallery

click on the three line symbol in the upper right to go to the gallery index

### how to enter imagebam gallery

Below a single photo there's a button labeled "Back to gallery"

### how to enter imgbox gallery

click on the title of the gallery, next to the imgbox logo on the upper left

## FAQ

### Q: When I click a download-button, I must confirm the connect

That's a security measure of your userscript runner. Just confirm it

### Q: why is the userscript so large?

A: It contains the zip.js library. I don't want to load scripts from external resource to minimize tracking.

### Q: where is the zip generated?

A: the zip is generated inside your browser, no data leaves your machine.

### Q: why is the downloading to slow?

A: some sites throttle the connection. I'll look into making more downloads parallel 

### Q: can this script download from one click file hosters?

A: no, only from imagehosters

### Q: can I compile the script myself?

A: Yes, download/clone this repo, then run `npm install` and `npm run build`

### Q: can you add hoster XYZ?

A: Yes, please open an issue


