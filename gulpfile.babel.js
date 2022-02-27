import gulp from "gulp";
import del from "del";
import image from "gulp-image";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import bro from "gulp-bro";
import babelify from "babelify";
import include from "gulp-file-include";
import sourcemaps from "gulp-sourcemaps";

const sass = gulpSass(dartSass);

const routes = {
    html: {
        src: "src/**/*.html",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        src: "src/scss/**/*.scss",
        dest: "build/scss",
        dest2: "src/scss"
    },
    js: {
        src: "src/js/main.js",
        dest: "build/js"
    },
}

const clean = async () => del(["build", "src/scss/style.css"]);

const htmlOut = async () =>
    gulp
        .src(routes.html.src)
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(routes.html.dest))

const imgOut = async () =>
    gulp
        .src(routes.img.src)
        .pipe(image())
        .pipe(gulp.dest(routes.img.dest))

const scssOut = async () =>
    gulp
        .src(routes.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(routes.scss.dest))
        .pipe(gulp.dest(routes.scss.dest2));

const jsOut = async () =>
    gulp
        .src(routes.js.src)
        .pipe(bro({
            transform: [
                babelify.configure({ presets: ['@babel/preset-env'] }),
                ['uglifyify', { global: true }]
            ]
        }))
        .pipe(gulp.dest(routes.js.dest));

const watches = async () => {
    gulp.watch(routes.html.src, htmlOut);
    gulp.watch(routes.img.src, imgOut);
    gulp.watch(routes.scss.src, scssOut);
    gulp.watch(routes.js.src, jsOut);
}

export const dev = gulp.series([clean, htmlOut, imgOut, scssOut, jsOut, watches]);