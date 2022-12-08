import {Abstract} from "./Abstract.js";

export class IbbCo extends Abstract {
    postMatchFragment = 'https://ibb.co';

    getImageURIs(node, callback) {
        let nodes = Array.from(node.querySelectorAll('a[href*="ibb.co"]'));
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
                context: node,
                cookie: 'nsfw_inter=1',
                onload: response => {



                    if (/<link rel="image_src" href="(.*)">/.exec(response.response)) {
                        const match = /<link rel="image_src" href="(.*)">/.exec(response.response);
                        urls.push([match[1], match[1].split('/').pop()]);
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
}