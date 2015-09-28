var gulp = require("gulp"),
    path = require("path"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    pkg = require("./package.json"),
    jshint = require("gulp-jshint"),
    replace = require('gulp-replace');

var SRC = "src";

var SRC_SASS_MAIN = path.join(SRC, "scss", "main.scss");
var SRC_JAVASCRIPT_BASE = path.join(SRC, "js");
var SRC_IMAGES_BASE = path.join(SRC, "img");

var SRC_ALL = path.join(SRC, "**");
var SRC_HTML = path.join(SRC, "**", "*.html");
var SRC_JAVASCRIPT_ALL = path.join(SRC_JAVASCRIPT_BASE, "**", "*.js");
var SRC_IMAGES_ALL = path.join(SRC_IMAGES_BASE, "**", "*");
var SRC_JSON_ALL = path.join(SRC, "**", "*.json");

var DIST = "dist";
var DIST_LIB = path.join(DIST, "lib");
var DIST_ALL = path.join(DIST, "**");
var DIST_SASS = path.join(DIST, "css");
var DIST_JAVASCRIPT = path.join(DIST, "js");
var DIST_IMAGES = path.join(DIST, "img");

var MAIN_SCRIPT = "index.js";


// SASS
// Compile sass sources in CSS, auto-prefix and minify the CSS
gulp.task("sass", ["update"], function () {
    return gulp.src(SRC_SASS_MAIN)
        .pipe(require("gulp-sass")(SRC_SASS_MAIN))
        .pipe(require("gulp-autoprefixer")("last 2 version", "safari 5", "ie 8", "ie 9", "opera 12.1", "ios 6", "android 4"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(require('gulp-minify-css')())
        .pipe(gulp.dest(DIST_SASS));
});

// JavaScript
// Run JSHint on all of the app/js files and concatenate everything together and uglify
gulp.task("javascript", ["update"], function () {
    return gulp.src(SRC_JAVASCRIPT_ALL)
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(require("gulp-concat")(MAIN_SCRIPT))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(require('gulp-ngmin')()) // ngmin makes angular injection syntax compatible with uglify
        .pipe(require("gulp-uglify")())
        .pipe(gulp.dest(DIST_JAVASCRIPT));
});

// Images
gulp.task("images", ["update"], function () {
    return gulp.src(SRC_IMAGES_ALL)
        .pipe(gulp.dest(DIST_IMAGES));
});

// Copy the html assets without modification
// Replace the non-minified paths in html assets with the minified paths
gulp.task("html", ["update"], function () {
    return gulp.src(SRC_HTML)
        .pipe(replace(/\.js/g, ".min.js"))
        .pipe(replace(/\.css/g, ".min.css"))
        .pipe(gulp.dest(DIST));
});

gulp.task("json", ["update"], function () {
    return gulp.src(SRC_JSON_ALL)
        .pipe(gulp.dest(DIST));
});

// Copy Bower assets
gulp.task("copy-bower", ["update"], function () {
    return gulp.src("bower_components/**")
        .pipe(gulp.dest(DIST_LIB));
});

// Dist everything
gulp.task("dist", ["copy-bower", "html", "json", "sass", "javascript", "images"]);

// Clean the DIST dir
gulp.task("clean", function () {
    return gulp.src([DIST, ".build"], {
            read: false
        })
        .pipe(require("gulp-clean")());
});

// Updates the Bower dependencies based on the bower.json file
gulp.task("update", function (next) {
    next();
});

// Server that serves static content from DIST
gulp.task("server", ["dist"], function (next) {
    var port = 5000;
    var connect = require("connect");
    var serveStatic = require("serve-static");
    var server = connect();
    server.use(serveStatic(DIST)).listen(port, next);
    gutil.log("Server up and running: http://localhost:" + port);
});

// Auto-Reloading Development Server
gulp.task("dev", ["server"], function () {
    gulp.watch(SRC_ALL, ["dist"]);
    gulp.watch("bower.json", ["copy-bower"]);

    //var livereload = require("gulp-livereload"); // No workie, maka mi sad

    //gulp.watch(DIST_ALL).on("change", function (file) {
        //livereload.changed(file.path);
    //});
});