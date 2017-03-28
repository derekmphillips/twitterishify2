var gulp = require('gulp');
var fs = require('fs');
var gzip = require('gulp-gzip');
var merge = require('merge2');
var concat = require('gulp-concat');
var minimist = require('minimist');
var uglify = require("gulp-uglify");
var ngAnnotate = require('gulp-ng-annotate');
var minifyHtml = require('gulp-htmlmin');
var connect = require('gulp-connect');
var bower = require('gulp-bower');
var mainBowerFiles = require('main-bower-files');
var css = require('./gulp-tasks/css');
var assets = require('./gulp-tasks/assets');
var polyfills = require('./gulp-tasks/polyfills');
var templates = require('./gulp-tasks/templates');
var scripts = require('./gulp-tasks/scripts');
var rimraf = require('rimraf');
var watch = require('gulp-watch');
var gulpInstall = require('gulp-install');
var modRewrite = require('connect-modrewrite');


gulp.task('bower-install', function() {
  // Runs bower install --production
  return gulp.src('bower.json')
    .pipe(gulpInstall({production: true, allowRoot: true}));
});

gulp.task('bower-install-dev',  function() {
  return bower()
    .pipe(gulp.dest('./bower_components'));
});

gulp.task('bower-local', ['bower-install-dev'], function() {
  return gulp.src(mainBowerFiles({includeDev: false}), {base: 'bower_components'})
    .pipe(gulp.dest('libs'));
});

gulp.task('bower-production', ['bower-install', 'create-dirs'], function() {
  // moves main files to lib folder
  return gulp.src(mainBowerFiles({includeDev: false}), {base: 'bower_components'})
    .pipe(gulp.dest('libs'));
});


gulp.task('bower-dev', ['bower-install-dev', 'create-dirs'], function() {
  // moves main files to lib folder
  return gulp.src(mainBowerFiles({
    includeDev: 'inclusive'
  }), {base: 'bower_components'})
    .pipe(gulp.dest('libs'));
});

gulp.task('create-dirs', function() {
  var dirs = ['build', 'dist', 'libs', 'test'];
  rimraf.sync('libs');
  dirs.forEach(function(dir) {
    try {
      fs.mkdirSync(dir);
    } catch(e) {
      if (e.code != 'EEXIST') {
        throw e;
      }
    }
  });
});



gulp.task('default', ['build']);

gulp.task('build', ['create-dirs', 'bower-local'], function() {
    var cssStream = css.processSass();
    var scriptStream = scripts.processScripts();
    var dependenciesStream = scripts.processDeps();
    var routesStream = scripts.processRoutes();
    var templatesStream = templates.processTemplates();
    var index = gulp.src('src/index.html');
    var assetsStream = assets.processAssets();
    var polyfillsStream = polyfills.processPolyfills();
    var js = merge(dependenciesStream, templatesStream, scriptStream, routesStream)
      .pipe(concat('app.js'));
    var streams = merge([cssStream, js, assetsStream, polyfillsStream, index]);
    return streams.pipe(gulp.dest('build'))
});

var options = minimist(process.argv.slice(2), {
  string: 'dest',
  default: {dest: 'dist'}
})

gulp.task('production-helper', ['create-dirs', 'bower-production'], function() {
  var cssStream = css.minifyCss(css.processSass());
  var scriptStream = scripts.processScripts().pipe(ngAnnotate()).pipe(uglify());
  var dependenciesStream = scripts.processDeps().pipe(ngAnnotate()).pipe(uglify());
  var routesStream = scripts.processRoutes().pipe(uglify({mangle: false}));
  var templatesStream = templates.minifyTemplates();
  var assetsStream = assets.processAssets();
  var index = gulp.src('src/index.html').pipe(minifyHtml({
      empty: true
    }));
  var manifest = gulp.src('src/twitter.appcache');

  var polyfillsStream = polyfills.processPolyfills();
  var js = merge(dependenciesStream, templatesStream, scriptStream, routesStream)
    .pipe(concat('app.js'));
  var streams = merge([cssStream, js, assetsStream, polyfillsStream, index, manifest]);
  return streams
    .pipe(gulp.dest(options.dest));
});

gulp.task('production', ['production-helper'], function () {
  var src = [options.dest, '**', '*.{html,css,js,eot,svg,ttf,otf,json}'].join('/');
  return gulp.src(src)
    .pipe(gzip({ gzipOptions: { level: 9 } }))
    .pipe(gulp.dest(options.dest));
});


gulp.task('server', ['build'], function() {
  connect.server({
    livereload: true,
    root: 'build',
    port: 8000,
    https: false,
    middleware: function() {
      return [
        modRewrite(['^/api/(.*)$ http://localhost:3000/api/$1 [P]'])
      ]
    }
  });
});

gulp.task('reload', ['build'], function() {
  return gulp.src('./build/**/*')
    .pipe(connect.reload());
});

gulp.task('dev', ['watch', 'server']);

gulp.task('watch', function() {
  watch(['src/**', 'images/**', 'assets/**', 'polyfills/**', 'fonts/**', 'bower.json'], function() {
    gulp.start('reload');
  });
});



gulp.task('build-test', ['create-dirs', 'bower-dev'], function() {
  var dependenciesStream = scripts.processDeps().pipe(concat('app-deps.js'));
  var templatesStream = templates.processTemplates().pipe(concat('templates.js'));

  return merge([dependenciesStream, templatesStream]).pipe(gulp.dest('test'));
});


gulp.task('test', ['build-test'], function (done) {
  var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
