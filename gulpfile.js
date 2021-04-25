const { src, dest, parallel, series, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

const config = {
  mode: {
    stack: {
      sprite: "../sprite.svg"
    }
  }
};

const browsersync = () => {
  browserSync.init({
    server: {
      baseDir: ["layout-designer-project-lvl3", "app", "build"],
      directory: true
      //index: "chat.html",
    }
  });
};

const buildHtml = () => src('app/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(dest('build'));

const buildCss = () => src(['app/scss/app.scss'])
  .pipe(sass())
  .pipe(concat('style.css'))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(dest('build'))
  .pipe(browserSync.stream());

const buildSvg = () => src('app/images/icons/*.svg')
  .pipe(svgSprite(config))
  .pipe(dest('build/images'));

const buildImages = () => src('app/images/**/*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
]))
  .pipe(dest('build/images'));

const startWatch = () => {
  watch('app/**/*.pug', buildHtml);
  watch('build/**/*.{html,css}').on('change', browserSync.reload);
  watch('app/scss/**/*.scss', buildCss);
  watch('app/images/icons/*.svg', buildSvg);
  watch('app/images/*', buildImages);
};

const cleanDist = () => del('build/**/*', { force: true });

const copyJs = () => src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js'])
  .pipe(dest('build/js'));

exports.default = series(cleanDist, parallel(buildHtml, buildCss, buildSvg, buildImages, copyJs), parallel(browsersync, startWatch));