import * as zip from "@zip.js/zip.js"

export class Abstract {

    postMatchFragment = 'invalid';
    zipWriter = null;
    filesToGo = 0;
    urlCount = 0;
    urls = [];
    errors = [];

    probeDomain(uri) {
        return false;
    }

    probeDocument(uri, document) {
        return false;
    }

    getImageURIsFromPost(node, callback){
        this.getImageURIs(node, callback);
    }

    getFilename() {
        return 'untitled gallery';
    }


    async downloadWhenReady() {
        if (this.urls.length > 0) {
            this.fetch();
            return;
        }

        const blobURL = URL.createObjectURL(await this.zipWriter.close());
        this.zipWriter = null;
        window.dispatchEvent(new CustomEvent(`izd:dl-url`, {
            detail: {
                url: blobURL,
                filename: this.getFilename() + '.zip'
            }
        }));
        console.log( {
            detail: {
                url: blobURL,
                filename: this.getFilename() + '.zip'
            }
        })

    }

    zipFromUrls(urls) {
        this.zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"), {bufferedWrite: true});
        this.urls = urls;//urls.slice(0, 5);
        this.urlCount = this.urls.length;
        this.filesToGo = urls.length;
        this.fetch();
    }

    fetch() {
        const url = this.urls.shift();
        this.message(`${this.urlCount - this.urls.length}/${this.urlCount}: fetching full size image`);

        GM.xmlHttpRequest({
            url: url[0],
            responseType: 'blob',
            onload: response => {
                this.zipWriter.add(url[1], new zip.BlobReader(response.response), {level: 0}).then(this.downloadWhenReady.bind(this));
            },
            onerror: response => {
                this.message(`${this.urlCount - this.urls.length}/${this.urlCount}: FAILED to fetch full size image`)
                console.log(response)
                this.errors.push(`Image ${this.urlCount - this.urls.length}/${this.urlCount} couldn't be loaded`);
                this.downloadWhenReady();
            },
            onprogress: progress => {
                this.emitProgress({
                    perc: progress.loaded / progress.total,
                    loaded: this.formatBytes(progress.loaded),
                    total: this.formatBytes(progress.total)
                });
            }
        })
    };

    message(message, eventName = 'message') {
        message = this.constructor.name + ': ' + message;
        window.dispatchEvent(new CustomEvent(`izd:${eventName}`, {detail: {message}}));
    };

    emitProgress(progress) {
        window.dispatchEvent(new CustomEvent('izd:progress', {detail: {progress}}));
    }

    zeroPad(n, l = 3) {
        return ('0'.repeat(l) + n).slice(-l);
    }

    formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes'

        const k = 1024
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

        const i = Math.floor(Math.log(bytes) / Math.log(k))

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    findPosts(){
        document.querySelectorAll(`a[href*="${this.postMatchFragment}"]`).forEach(node => {
            if(!node.parentNode.dataset.izdHandler){
                node.parentNode.dataset.izdHandler = this.constructor.name;
            }
        })
    }
}
