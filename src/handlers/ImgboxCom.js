import {Abstract} from "./Abstract.js";

export class ImgboxCom extends Abstract{
    //demo: https://imgbox.com/g/6RoduNs2xQ

    postMatchFragment = 'imgbox.com/';

    probeDomain(uri) {
        return /imgbox\.com/.test(uri);
    }

    probeDocument(uri, document) {
        if (!/\/g\//.test(uri)) {
            return false;
        }

        if (document.querySelectorAll('#gallery-view-content a').length === 0) {
            return false;
        }

        return true;
    }


    getImageURIs(node, callback, selector = '#gallery-view-content a img') {
        callback(Array.from(node.querySelectorAll(selector)).map((node, i) => [
                node.getAttribute('src').replace('https://thumbs', 'https://images').replace('_b','_o').replace('_t','_o'),
                `image_${this.zeroPad(i)}.jpg`
            ]
        ));
    }

    getImageURIsFromPost(node, callback){
        this.getImageURIs(node, callback, 'a[href*="imgbox.com"] img');
    }

    getFilename() {
        return document.querySelector('#gallery-view > h1') ? document.querySelector('#gallery-view > h1').textContent : 'untitled gallery';
    }

}