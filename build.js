const fs = require("fs");
const path = require("path");
const browserify = require("browserify");
const tsify = require("tsify");

const outDir = path.join(__dirname, "./dist/js");
const srcDir = path.join(__dirname, "./src");
const defFile = path.join(srcDir, "defs.d.ts");

for (let file of ["main", "options", "background"]) {
    browserify({ paths: [ srcDir ] })
        .add(defFile)
        .add(path.join(srcDir, file + ".ts"))
        .plugin("tsify", {
            module: "commonjs",
            target: "es6",
            baseUrl: srcDir
        })
        .bundle((err, buf) => {
            if (err) throw err;
            fs.writeFile(path.join(outDir, file + ".js"), buf, (err) => {
                if ( err ) throw err;
                console.log(file + ".js saved");
            });
        });
}