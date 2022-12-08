import {Abstract} from "./Abstract.js";

export class AcidimgCc extends Abstract{
    postMatchFragment = 'https://acidimg.cc/img';

    getImageURIs(node, callback) {
        callback(Array.from(node.querySelectorAll('a[href*="acidimg.cc/img"] img')).map((node, i) => [
                node.getAttribute('src').replace(/.*small/, 'https://i.acidimg.cc/i/'),
                node.getAttribute('alt') || `file_${this.zeroPad(i)}.jpg`
            ]
        ));
    }
}