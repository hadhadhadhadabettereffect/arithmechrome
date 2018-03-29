const fs = require("fs");
const path = require("path");
const browserify = require("browserify");
const tsify = require("tsify");
const pug = require("pug");
const uglifycss = require("uglifycss");
const package = require("./package.json");

const outDir = path.join(__dirname, "./dist");
const srcDir = path.join(__dirname, "./src");
const defFile = path.join(srcDir, "js", "defs.d.ts");

const compiledFunction = pug.compileFile(path.join(srcDir, "options.pug"));
var htmlString = compiledFunction({title: package.name});
var cssString = uglifycss.processFiles([path.join(srcDir, "styles", "options.css")]);

fs.writeFileSync(path.join(outDir, "options.css"), cssString);
fs.writeFileSync(path.join(outDir, "options.html"), htmlString);

for (let file of ["main", "options", "background"]) {
    browserify({ paths: [ srcDir ] })
        .add(defFile)
        .add(path.join(srcDir, "js", file + ".ts"))
        .plugin("tsify", {
            module: "commonjs",
            target: "es6",
            baseUrl: srcDir
        })
        .bundle((err, buf) => {
            if (err) throw err;
            fs.writeFile(path.join(outDir, "js", file + ".js"), buf, (err) => {
                if ( err ) throw err;
                console.log(file + ".js saved");
            });
        });
}