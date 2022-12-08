// ==UserScript==
// @name         image zip downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  downloads images from misc image hosts, running local, private and secure
// @author       some dude
// @match        *://*.pixhost.to/*
// @match        *://*.imagebam.com/*
// @match        *://*.imgbox.com/*
// @match        *://*.vintage-erotica-forum.com/*
// @match        *://*.vipergirls.to/*
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      acidimg.co
// @connect      ibb.co
// @connect      imagebam.com
// @connect      imgbox.com
// @connect      imx.to
// @connect      pixhost.to
// @connect      vipr.im
// @require      file:///...compiled-script.js
// ==/UserScript==

/*
    use this for development. Enable "access local files" for your tampermonkey plugin and add the correct path
    in the @require header above
 */