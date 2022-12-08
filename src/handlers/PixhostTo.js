import {Abstract} from "./Abstract.js";

export class PixhostTo extends Abstract {

    postMatchFragment = 'https://pixhost.to';

    //demo: https://pixhost.to/gallery/IUomw

    probeDomain(uri) {
        return /pixhost\.to/.test(uri);
    }

    probeDocument(uri, document) {
        if (!/gallery/.test(uri)) {
            return false;
        }

        if (document.querySelectorAll('a[href*=show] img').length === 0) {
            return false;
        }

        return true;
    }

    getImageURIs(node, callback) {
        callback(Array.from(node.querySelectorAll('a[href*=show] img')).map((node, i) => [
                node.getAttribute('src').replace('https://t', 'https://img').replace('/thumbs/', '/images/'),
                node.getAttribute('alt') || `image_${this.zeroPad(i)}.jpg`
            ]
        ));
    }

    getFilename() {
        return document.querySelector('a.link[href*=gallery] > h2') ? document.querySelector('a.link[href*=gallery] > h2').textContent : 'untitled gallery';
    }


}