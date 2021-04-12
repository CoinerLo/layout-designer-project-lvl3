const { src, dest, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const svgSprite = require('gulp-svg-sprite');
const imagemin = require('gulp-imagemin');

const config = {
  mode: {
    stack: {
      sprite: "../sprite.svg"
    }
  }
};

const buildHtml = () => src('app/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(dest('build'));

const buildCss = () => src(['app/scss/app.scss'])
  .pipe(sass())
  .pipe(concat('style.css'))
	.pipe(dest('build'));

const buildSvg = () => src('app/images/icons/*.svg')
  .pipe(svgSprite(config))
  .pipe(dest('build/images'));

const buildImages = () => src('app/images/*.*')
  .pipe(imagemin())
  .pipe(dest('build/images'));

exports.default = parallel(buildHtml, buildCss, buildSvg, buildImages);