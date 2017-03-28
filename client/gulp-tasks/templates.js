var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require('gulp-htmlmin');

function createModule(src) {
  return src.pipe(templateCache('templates.js', {
      standalone: true,
      module: 'twitterTemplates'
    }));
}

function processTemplates() {
  var src = gulp.src(['src/**/*.html', '!src/index.html']);
  return createModule(src);
}

function minifyTemplates() {
  var src = gulp.src(['src/**/*.html', '!src/index.html'])
  .pipe(minifyHtml({
    empty: true
  }));
  return createModule(src);
}



exports.processTemplates = processTemplates;
exports.minifyTemplates = minifyTemplates;
