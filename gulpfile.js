const gulp = require("gulp");
const ts = require("gulp-typescript");
const pug = require("gulp-pug");
const csso = require("gulp-csso");
const uglify = require("gulp-uglify");
const pump = require("pump");

gulp.task("js", function (cb) {
    pump([
        gulp.src("src/js/*.ts"),
        ts(),
        uglify(),
        gulp.dest("dist/js")
    ], cb);
});

gulp.task("html", function () {
    return gulp.src("src/options.pug")
        .pipe(pug())
        .pipe(gulp.dest("dist"));
});

gulp.task("css", function () {
    return gulp.src("src/styles/options.css")
        .pipe(csso())
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["js", "html", "css"]);