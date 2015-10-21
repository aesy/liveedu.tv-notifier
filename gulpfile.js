var gulp = require("gulp"),
    path = require("path"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    pkg = require("./package.json"),
    jshint = require("gulp-jshint"),
    replace = require('gulp-replace'),
    wrap = require("gulp-wrap"),
    webserver = require('gulp-webserver');

var SRC = "src";

var SRC_SASS_MAIN = path.join(SRC, "scss", "main.scss");
var SRC_SASS_BASE = path.join(SRC, "scss");
var SRC_JAVASCRIPT_BASE = path.join(SRC, "js");
var SRC_IMAGES_BASE = path.join(SRC, "img");

var SRC_ALL = path.join(SRC, "**");
var SRC_HTML = path.join(SRC, "**", "*.html");
var SRC_SASS_ALL = path.join(SRC_SASS_BASE, "**", "*.scss");
var SRC_JAVASCRIPT_ALL = path.join(SRC_JAVASCRIPT_BASE, "**", "*.js");
var SRC_IMAGES_ALL = path.join(SRC_IMAGES_BASE, "**", "*");
var SRC_JSON_ALL = path.join(SRC, "**", "*.json");

var DIST = "dist";
var DIST_LIB = path.join(DIST, "lib");
var DIST_ALL = path.join(DIST, "**");
var DIST_SASS = path.join(DIST, "css");
var DIST_JAVASCRIPT = path.join(DIST, "js");
var DIST_IMAGES = path.join(DIST, "img");

var MAIN_SCRIPT = "app.js";


gulp.task("sass", function () {
    return gulp.src(SRC_SASS_MAIN)
        .pipe(require("gulp-sass")(SRC_SASS_MAIN))
        .pipe(require("gulp-autoprefixer")("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(require('gulp-minify-css')())
        .pipe(gulp.dest(DIST_SASS));
});

gulp.task("javascript", function () {
    return gulp.src(SRC_JAVASCRIPT_ALL)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(require("gulp-concat")(MAIN_SCRIPT))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(require('gulp-ngmin')()) // ngmin makes angular injection syntax compatible with uglify
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        //.pipe(require("gulp-uglify")())
        .pipe(gulp.dest(DIST_JAVASCRIPT));
});

gulp.task("images", function () {
    return gulp.src(SRC_IMAGES_ALL)
        .pipe(gulp.dest(DIST_IMAGES));
});

gulp.task("html", function () {
    return gulp.src(SRC_HTML)
        .pipe(gulp.dest(DIST));
});

gulp.task("json", function () {
    return gulp.src(SRC_JSON_ALL)
        .pipe(gulp.dest(DIST));

});

gulp.task("copy-bower", function () {
    return gulp.src("bower_components/**")
        .pipe(gulp.dest(DIST_LIB));
});

gulp.task("dist", ["html", "json", "sass", "javascript", "images", "copy-bower"]);

gulp.task("server", function() {
    gulp.src(DIST)
        .pipe(webserver({
            port: 5000,
            open: true,
            fallback: 'popup.html'
        }));

    gulp.watch(SRC_HTML, ["html"]);
    gulp.watch(SRC_IMAGES_ALL, ["images"]);
    gulp.watch(SRC_JAVASCRIPT_ALL, ["javascript"]);
    gulp.watch(SRC_JSON_ALL, ["json"]);
    gulp.watch(SRC_SASS_ALL, ["sass"]);
    gulp.watch("bower.json", ["copy-bower"]);

    var livereload = require("gulp-livereload");
    livereload.listen();

    gulp.watch(DIST_ALL).on("change", function (file) {
        gulp.src(file.path)
            .pipe(livereload());
    });
});

gulp.task("clean", function () {
    return gulp.src([DIST, ".build"], {
            read: false
        })
        .pipe(require("gulp-clean")());
});