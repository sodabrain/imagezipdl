import {Abstract} from "./Abstract.js";

export class ImagebamCom extends Abstract {
    postMatchFragment = 'imagebam.com/';
    // demo https://www.imagebam.com/gallery/tmhqizmx23utvz0qon6otf6a6773ema8?page=1

    probeDomain(uri) {
        return /imagebam\.com/.test(uri);
    }

    probeDocument(uri, document) {
        if (!/gallery/.test(uri)) {
            return false;
        }

        if (document.querySelectorAll('a[href*="/image/"] img').length === 0) {
            return false;
        }

        if (document.querySelector('.pagination')) {
            this.message('This gallery has multiple pages, make sure to download them all...', 'warn');

        }


        return true;
    }

    setCookie(){
        //fake cookie
        let date = new Date();
        date.setTime(date.getTime() + (6 * 60 * 60 * 1000));
        document.cookie = "nsfw_inter=1" + "; expires=" + date.toUTCString() + "; path=/";
    }

    getImageURIs(node, callback, selector = 'a[href*="/image/"]') {

        this.setCookie();

        let nodes = Array.from(node.querySelectorAll(selector));
        let urls = [];

        //nodes = nodes.slice(2, 4);
        let nodeCount = nodes.length;

        const scrape = () => {
            const node = nodes.shift();
            if (!node) {
                callback(urls);
                return;
            }
            GM.xmlHttpRequest({
                url: node.getAttribute('href'),
                context : node,
                cookie: 'nsfw_inter=1',
                onload: response => {

                    if (
                        /href="https:\/\/images\d*.imagebam.com[a-f0-9jpg/.]+" target="_blank"/.test(response.response)
                        ||
                        /href="https:\/\/www.imagebam.com\/view\/[A-Z0-9]+\?full=1"/.test(response.response)
                    ) {
                        const matches = /src="(https:\/\/images\d*.imagebam.com[a-f0-9jpg/.]+)" alt="(.*)" /.exec(response.response);
                        if(matches){
                            urls.push([matches[1], matches[2]]);
                        }else{
                            const matches = /src="(https:\/\/images\d*.imagebam.com[A-Za-z0-9/._]+)" alt="(.*)" /.exec(response.response);
                            urls.push([matches[1], matches[2]]);
                        }

                        this.message(`${nodeCount - nodes.length}/${nodeCount}: fetching full size image url`)
                    } else {
                        this.message(`${nodeCount - nodes.length}/${nodeCount}: failed to fetch full size image url`)
                    }
                    scrape();
                }
            })
        };

        scrape();
    }

    getImageURIsFromPost(node, callback){
        this.getImageURIs(node, callback, 'a[href*="imagebam.com"]');
    }

    getFilename() {
        return document.querySelector('#gallery-name') ? document.querySelector('#gallery-name').textContent : 'untitled gallery';
    }

}