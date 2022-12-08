import {PixhostTo} from "./handlers/PixhostTo.js";
import {ImagebamCom} from "./handlers/ImagebamCom.js";
import {ImgboxCom} from "./handlers/ImgboxCom.js";
import {ImxTo} from "./handlers/ImxTo.js";
import {AcidimgCc} from "./handlers/AcidimgCc.js";
import {ViprIm} from "./handlers/ViprIm.js";
import {IbbCo} from "./handlers/IbbCo.js";

export class ImageZipDownloader {
    supportedHosts = [
        new PixhostTo(), new ImagebamCom(), new ImgboxCom(),
        new ImxTo(), new AcidimgCc(), new ViprIm(), new IbbCo()
    ]

    warnings = [];
    htmlDeployed = false;
    activeHost = null;

    constructor() {

        window.addEventListener('izd:warn', e => {
            this.warnings.push(e.detail.message);
        });

        const uri = window.location.toString();

        let mode = 'forum';


        this.supportedHosts.forEach(host => {
            if (!this.activeHost && host.probeDomain(uri) && host.probeDocument(uri, document)) {
                mode = 'imagehost';
                this.activeHost = host;
            }
        });

        this.deployMarkup();
        if (mode === 'imagehost') {
            document.body.classList.add('izd-imagehost');
        } else {
            document.body.classList.add('izd-forum');
            this.supportedHosts.forEach(host => {
                if ('findPosts' in host && !host.probeDomain(uri)) {
                    host.findPosts();
                }
            });

            document.querySelectorAll('[data-izd-handler]').forEach(node => {
                node.insertAdjacentHTML('beforeend', `<p style="text-align:center"><button data-izd-handler="${node.dataset.izdHandler}">IZD: DOWNLOAD</button></p>`);
            });

            document.addEventListener('click', e => {
                if (e.target.matches('button[data-izd-handler]')) {
                    const activeHost = this.supportedHosts.find(host => host.constructor.name === e.target.dataset.izdHandler);
                    document.querySelector('#izd-backdrop').classList.add('in-progress');
                    activeHost.getImageURIsFromPost(e.target.parentNode.parentNode, urls => {
                        //console.log(urls)
                        //return;
                        activeHost.zipFromUrls(urls)
                    });

                }
            })

        }
    }

    deployMarkup() {
        document.body.insertAdjacentHTML('beforeend', `
            <style>
                #izd-backdrop{
                  position: fixed;
                  bottom: 0;
                  left:0;
                  right:0;
                  top:calc(100% - 40px);
                  background-color:#686868;
                  border-top:2px solid #232323;
                  font-size:14px;
                  padding-top:4px;
                  padding-bottom:4px;
                  box-sizing: border-box;
                  z-index:9999999;
                  display: none;
                }
                
                .izd-imagehost #izd-backdrop{
                    display:block;
                }
                
                #izd-backdrop.in-progress{
                    display:block;
                    top:0;
                    left:0;
                    right:0;
                    bottom:0;
                    border-top:none;
                    height: auto;
                    background-color:#686868bb;
                }
                .izd-imagehost #izd-notice{
                    box-sizing: border-box;
                    max-width:1920px;
                    margin:auto;
                    padding:10px;
                    color:#fff;
                    text-align: center;
                }
                .izd-forum #izd-notice,
                #izd-backdrop.in-progress #izd-notice{
                    display:none;
                }
                #izd-notice a{
                    color: #fff;
                }
                #izd-progress-box{
                    display: none;
                    position:absolute;
                    left:50%;
                    top:50%;
                    transform: translate(-50%, -50%);
                    border-radius: 5px;
                    background-color:#454545;
                    max-width:600px;
                    width:50vw;
                    height:300px;
                    flex-direction: column;
                }
                #izd-backdrop.in-progress #izd-progress-box{
                    display:flex;
                }
                
                #izd-progress-log{
                    flex-grow: 1;
                    overflow: hidden;
                    position: relative;
                    padding:5px;
                    font-family:monospace;
                    color:#fff;
                }
                
                #izd-progress-log > div{
                    position: absolute;
                    bottom:0;                
                }
                
                #izd-progress-log > div > div::after{
                    content:attr(data-progress);
                }
                
                #izd-warnings{
                    color:orange;
                    padding:5px;
                }
                
                #izd-controls{
                    padding:10px;
                    font-size:200%;
                    text-align: center;
                    color:#fff;
                    display:flex;
                    justify-content: space-around;
                }
                
                #izd-controls a{
                    display:none;
                    color:#fff;
                }
                
                .done #izd-controls a{
                    display:initial;
                    width:100%;
                }
                
                .done #izd-controls span{
                    display:none;
                }
                
            </style>
            <div id="izd-backdrop">
                <div id="izd-notice">Image Zip Downloader Userscript active: <a href="#">click to download gallery</a></div>
                <div id="izd-progress-box">
                    <div id="izd-warnings"></div>
                    <div id="izd-progress-log">
                            <div></div>
                    </div>
                    <div id="izd-controls">
                        <span>wait&hellip;</span>
                        <a href="#" id="izd-downloadbutton">Download ZIP</a>
                        <a href="#" id="izd-closebutton">Close window</a>
                    </div>
                </div>
            </div>
            
        `);

        document.querySelector('#izd-notice a').addEventListener('click', e => {
            e.preventDefault();
            this.commenceDownload(document);
        });
        document.querySelector('#izd-closebutton').addEventListener('click', e => {
            e.preventDefault();
            document.getElementById('izd-progress-box').classList.remove('done');
            document.getElementById('izd-backdrop').classList.remove('in-progress');
            document.querySelector('#izd-progress-log > div').innerHTML = '';
            document.querySelector('#izd-warnings').innerHTML = '';

        });

        window.addEventListener('izd:message', e => {
            document.querySelector('#izd-progress-log > div').insertAdjacentHTML('beforeend', `<div>${e.detail.message}</div>`);
        });

        window.addEventListener('izd:warn', e => {
            this.warnings.push(e.detail.message);
            this.renderWarnings();
        });

        window.addEventListener('izd:dl-url', e => {

            document.getElementById('izd-downloadbutton').setAttribute('download', e.detail.filename);
            document.getElementById('izd-downloadbutton').setAttribute('href', e.detail.url);
            document.getElementById('izd-progress-box').classList.add('done');
        });

        if (this.warnings.length > 0) {
            this.renderWarnings();
        }

        window.addEventListener('izd:progress', e => {
            document.querySelectorAll('#izd-progress-log > div > div[data-progress]').forEach(node => node.dataset.progress = '');
            document.querySelector('#izd-progress-log > div > div:last-child').dataset.progress = ' ' + (Math.round(e.detail.progress.perc * 10000) / 100) + `% ${e.detail.progress.loaded}/${e.detail.progress.total}`;
        });


    }

    renderWarnings() {
        let warning;
        while (warning = this.warnings.shift()) {
            document.querySelector('#izd-warnings').insertAdjacentHTML('beforeend', `<div>${warning}</div>`);
        }
    };

    commenceDownload(node) {
        document.querySelector('#izd-backdrop').classList.add('in-progress');
        this.activeHost.getImageURIs(document, urls => {
            this.activeHost.zipFromUrls(urls)
        });
    }
}