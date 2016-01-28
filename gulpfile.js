var gulp = require("gulp"),
    path = require("path"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    jshint = require("gulp-jshint"),
    replace = require("gulp-replace"),
    wrap = require("gulp-wrap"),
    webserver = require("gulp-webserver"),
    autoprefixer = require("gulp-autoprefixer"),
    sass = require("gulp-sass"),
    concat = require("gulp-concat"),
    ngmin = require("gulp-ngmin"),
    clean = require("gulp-clean"),
    uglify = require("gulp-uglify"),
    minify = require("gulp-minify-css"),
    flatten = require("gulp-flatten"),
    ext_replace = require("gulp-ext-replace"),
    es = require("event-stream");


var paths = {
    src: {
        get base() { return "src"; },
        get all()  { return path.join(paths.src.base, "**"); }
    },
    dist: {
        get base() { return "dist"; },
        get all()  { return path.join(paths.dist.base, "**"); },
        get lib()  { return path.join(paths.dist.base, "lib"); }
    },
    css: {
        get base()      { return path.join(paths.src.base, "assets", "styles"); },
        get main()      { return path.join(paths.css.base, "main.scss"); },
        get all()       { return path.join(paths.css.base, "**", "*.scss"); },
        get dist()      { return path.join(paths.dist.base, "css"); }
    },
    js: {
        get main()    { return "app.js"; },
        get base()    { return paths.src.base; },
        get all()     { return path.join(paths.js.base, "**", "*.js"); },
        get dist()    { return path.join(paths.dist.base, "js"); }
    },
    html: {
        get views()     { return path.join(paths.src.base, "**", "*.view.html"); },
        get pages()     { return path.join(paths.src.base, "**", "!(*.view)*.html"); },
        get distViews() { return path.join(paths.dist.base, "view"); },
        get distPages() { return paths.dist.base; }
    },
    img: {
        get base() { return path.join(paths.src.base, "assets", "images"); },
        get all()  { return path.join(paths.img.base, "**", "*"); },
        get dist() { return path.join(paths.dist.base, "img"); }
    },
    snd: {
        get base() { return path.join(paths.src.base, "assets", "sounds"); },
        get all()  { return path.join(paths.snd.base, "**", "*"); },
        get dist() { return path.join(paths.dist.base, "snd"); }
    },
    json: {
        get all()  { return path.join(paths.src.base, "**", "*.json"); },
        get dist() { return paths.dist.base; }
    }
};


gulp.task("Compile sass", function() {
    return gulp.src(paths.css.main)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(paths.css.dist));
});

gulp.task("Compile javascript", function () {
    return gulp.src(paths.js.all)
            .pipe(wrap("(function(){\n'use strict';\n<%= contents %>\n})();"))
            .pipe(ngmin())
            .pipe(concat(paths.js.main))
            .pipe(wrap("(function(){\n'use strict';\n<%= contents %>\n})();"))
            //.pipe(uglify())
            .pipe(rename({
                suffix: ".min"
            }))
            .pipe(gulp.dest(paths.js.dist));
});

gulp.task("Copy images", function () {
    return gulp.src(paths.img.all)
        .pipe(gulp.dest(paths.img.dist));
});

gulp.task("Copy sound", function () {
    return gulp.src(paths.snd.all)
        .pipe(gulp.dest(paths.snd.dist));
});

gulp.task("Copy html", function () {
    return es.merge(
        gulp.src(paths.html.pages)
            .pipe(flatten())
            .pipe(gulp.dest(paths.html.distPages)),

        gulp.src(paths.html.views)
            .pipe(flatten())
            .pipe(ext_replace(".html", ".view.html"))
            .pipe(gulp.dest(paths.html.distViews))
    );
});

gulp.task("Copy json", function () {
    return gulp.src(paths.json.all)
        .pipe(flatten())
        .pipe(gulp.dest(paths.json.dist));

});

gulp.task("Copy bower components", function () {
    return gulp.src("bower_components/**")
        .pipe(gulp.dest(paths.dist.lib));
});

gulp.task("Build dist", [
    "Copy html",
    "Copy json",
    "Compile sass",
    "Compile javascript",
    "Copy images",
    "Copy sound",
    "Copy bower components"
]);

gulp.task("Auto-compile", function() {
    gulp.watch(paths.html.all, ["Copy html"]);
    gulp.watch(paths.img.all,  ["Copy images"]);
    gulp.watch(paths.snd.all,  ["Copy sound"]);
    gulp.watch(paths.json.all, ["Copy json"]);
    gulp.watch(paths.js.all,   ["Compile javascript"]);
    gulp.watch(paths.css.all,  ["Compile sass"]);
    gulp.watch("bower.json",   ["Copy bower components"]);
});

gulp.task("Run server", function() {
    gulp.src(paths.dist.base)
        .pipe(webserver({
            port: 5000,
            //open: true,
            fallback: "popup.html"
        }));

    var livereload = require("gulp-livereload");
    livereload.listen();

    gulp.watch(paths.dist.all).on("change", function (file) {
        gulp.src(file.path)
            .pipe(livereload());
    });
});

gulp.task("Clean dist folder", function () {
    return gulp.src([paths.dist.base, ".build"], {
            read: false
        })
        .pipe(clean());
});