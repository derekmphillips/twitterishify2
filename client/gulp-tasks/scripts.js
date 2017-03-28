var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var modernizr = require('gulp-modernizr');
var gutil = require('gulp-util');
var order = require('gulp-order');
var merge = require('merge2');

function processScripts() {
  var js = gulp.src(['src/**/*.js', '!src/routes/**/*', '!src/modernize.js'])
    .pipe(order([
      'src/app.js',
      'src/constants.js',
      'src/app_configrations.js',
      'src/authorization/**/*.js',
      'src/app-version-management/*.js',
      'src/*.js',
      'src/**/*.js',
      ], {base: './'}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
  return js;
}

function processRoutes() {
return routes = gulp.src(['src/routes/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}

function processDeps() {
  var libs =  gulp.src('libs/**/*.js')
      .pipe(order([
        'libs/jquery/**/*.js',
        'libs/angular/*.js',
        'libs/satellizer/*.js',
        'libs/lodash/**/*.js',
        'libs/moment/**/*.js',
        'libs/moment-timezone/**/*.js',
        'libs/ng-file-upload-shim/**/*.js',
        'libs/**/*.js',
        ], { base: './'}));
  var modernizrSrc = gulp.src('src/modernize.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(modernizr());
  var modernizrTests = gulp.src('src/modernize.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
  return merge(libs, modernizrSrc, modernizrTests);
}

exports.processScripts = processScripts;
exports.processDeps = processDeps;
exports.processRoutes = processRoutes;
