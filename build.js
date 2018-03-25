const fs = require("fs");
const path = require("path");
const browserify = require("browserify");
const tsify = require("tsify");

const outDir = path.join(__dirname, "./dist");
const srcDir = path.join(__dirname, "./src");
const optionsSrc = path.join(srcDir, "options.ts");
const optionsDist = path.join(outDir, "options.js");

browserify({ paths: [ srcDir ] })
    .add(optionsSrc)
    .plugin("tsify", {
        module: "commonjs",
        baseUrl: srcDir
    })
    .bundle((err, buf) => {
        if (err) throw err;
        fs.writeFile(optionsDist, buf, (err) => {
            if ( err ) throw err;
            console.log("options.js saved");
        });
    });