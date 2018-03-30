const gulp = require("gulp");
const ts = require("gulp-typescript");
const pug = require("gulp-pug");
const csso = require('gulp-csso');

gulp.task("js", function () {
    var tsResult = gulp.src("src/js/*.ts")
        .pipe(ts());
    return tsResult.js.pipe(gulp.dest("dist/js"));
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