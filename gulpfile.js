const gulp = require("gulp");
const { watch, series } = require("gulp");
const imagemin = require("gulp-tinypng");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const babel = require("gulp-babel");
const minify = require("gulp-minify");
const concat = require("gulp-concat");
const html = require("gulp-nunjucks-render");
const gcmq = require("gulp-group-css-media-queries");
const wait = require("gulp-wait");

function server() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
      directory: true,
    },
    port: 1338,
    startPath: "/index.html",
  });
}

function onHtml() {
  return gulp
    .src("./src/pages/*.html")
    .pipe(plumber())
    .pipe(
      html({
        path: ["src/blocks/"],
      })
    )
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.stream());
}

function onSass() {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(plumber())
    .pipe(wait(200))
    .pipe(
      sass({
        outputStyle: "compressed",
      }).on("error", sass.logError)
    )
    .pipe(gcmq())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function onJs() {
  return gulp
    .src(["./src/js/*.js"])
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(minify())
    .pipe(gulp.dest("./dist/js"))
    .pipe(browserSync.stream());
}

function image() {
  return gulp
    .src("./src/img/*")
    .pipe(plumber())
    .pipe(imagemin("TeUNGpZ469E5GmikD8H9YfNfQwp60b9f"))
    .pipe(gulp.dest("./dist/img"))
    .pipe(browserSync.stream());
}

watch(
  [
    "./src/scss/*.scss",
    "./src/js/*.js",
    "./src/blocks/*.html",
    "./src/pages/*.html",
  ],
  series(onHtml, onSass, onJs, image, server)
);

exports.default = series(onHtml, onSass, onJs, image, server);
