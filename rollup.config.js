import nodeResolve from "@rollup/plugin-node-resolve";

export default [
    {
        input: 'src/imgzipdl.js',
        output: {
            name: 'image_zip_downloader',
            file: 'dist/compiled-script.js',
            format: 'umd',
            //extend: true
        },
            plugins : [nodeResolve()]
    }
];