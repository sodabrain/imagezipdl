import {readFileSync, writeFileSync} from "fs";

const template = readFileSync('src/imgzipdl.userscript.js-template', 'utf-8');
const compiled = readFileSync('dist/compiled-script.js', 'utf-8');

writeFileSync('dist/imgzipdl.userscript.js',template + "\n" + compiled);
