import {Abstract} from "./Abstract.js";

export class ImxTo extends Abstract {
    postMatchFragment = 'https://imx.to';

    getImageURIs(node, callback) {
        callback(Array.from(node.querySelectorAll('a[href*="imx.to"] img')).map((node, i) => {

                let url = node.getAttribute('src').replace('/t/', '/i/');
                if (/upload\/small/.test(url)) {
                    url = url.replace('/upload/small/', '/i/');
                    url = url.replace('//', '//i001.')
                }


                return [
                    url,
                    node.getAttribute('alt') || `file_${this.zeroPad(i)}.jpg`
                ]
            }
        ));
    }

}