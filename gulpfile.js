"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const gcmq = require("gulp-group-css-media-queries");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const plumber = require("gulp-plumber");
const rigger = require("gulp-rigger");
const stylelint = require("gulp-stylelint");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const sequence = require("run-sequence");
const wrap = require("gulp-wrap");
const declare = require("gulp-declare");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");

gulp.task("html", () => {
  return gulp
    .src("./src/*.html")
    .pipe(rigger())
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(gulp.dest("./templates"));
});

gulp.task("styles", () => {
  return gulp
    .src("./src/sass/styles.scss")
    .pipe(plumber())
    .pipe(
      stylelint({
        reporters: [{ formatter: "string", console: true }]
      })
    )
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(gcmq())
    .pipe(gulp.dest("./static/css"))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("./static/css"))
    .pipe(server.stream());
});

gulp.task("scripts", () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(plumber())
    .pipe(
      webpackStream(webpackConfig),
      webpack
    )
    // .pipe(uglify())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("./static/js"));
});

gulp.task("sprite", () => {
  return gulp
    .src("./src/images/icons/icon-*.svg")
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("./static/images"));
});

gulp.task("images", () => {
  return gulp
    .src(["./src/images/**/*.{png,jpg,jpeg,svg}", "!./src/images/icons/**/*"])
    .pipe(
      imagemin([
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(gulp.dest("./static/images"));
});

gulp.task("fonts", () => {
  return gulp.src("./src/fonts/**/*").pipe(gulp.dest("./static/fonts"));
});

gulp.task("watch", () => {
  gulp.watch("src/**/*.html", ["html"]).on("change", server.reload);
  gulp.watch("src/sass/**/*.scss", ["styles"]);
  gulp.watch("src/js/**/*.js", ["scripts"]).on("change", server.reload);
});

gulp.task("serve", ["styles"], () => {
  return server.init({
    // server: "./build",
    open: true,
    cors: true,
    ui: false,
    logPrefix: "DevServer",
    host: "localhost",
    port: 3000,
    notify: false,
    proxy: "localhost:8000"
  });
});

gulp.task("del:build", () => del(["./templates/**/*.html", "./static/**/*.css", "./static/**/*.js"]));

gulp.task("prepare", () => del(["**/.gitkeep", "README.md", "banner.png"]));

gulp.task("build", callback =>
  sequence(
    "del:build",
    ["sprite", "images", "fonts", "styles", "html", "scripts"],
    callback
  )
);

gulp.task("start", callback => sequence("build", "serve", "watch", callback));
