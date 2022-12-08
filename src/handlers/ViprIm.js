import {Abstract} from "./Abstract.js";

export class ViprIm extends Abstract{
    postMatchFragment = 'https://vipr.im';
    getImageURIs(node, callback) {
        callback(Array.from(node.querySelectorAll('a[href*="vipr.im"] img')).map((node, i) => [
                node.getAttribute('src').replace('/th/', '/i/'),
                node.getAttribute('alt') || `file_${this.zeroPad(i)}.jpg`
            ]
        ));
    }
}