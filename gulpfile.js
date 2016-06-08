var gulp         = require('gulp'),
  bower          = require('gulp-bower'),
  mainBowerFiles = require('main-bower-files'),
  concat         = require('gulp-concat'),
  less           = require('gulp-less'),
  plumber        = require('gulp-plumber'),
  sourcemaps     = require('gulp-sourcemaps'),
  webserver      = require('gulp-webserver'),
  coffee         = require('gulp-coffee'),
  rimraf         = require('gulp-rimraf'),
  cors           = require('cors'),
  _              = require('lodash'),
  replace        = require('gulp-replace'),
  uglify         = require('gulp-uglify');

gulp.task('bower', function() {
  return bower('./public/lib');
});

gulp.task('bower:concat', ['bower'], function(){
  return gulp.src(mainBowerFiles({filter: /\.js$/}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('dependencies.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

var cssDependencies = [
  './public/lib/fontawesome/css/font-awesome.css',
  './public/lib/prism/themes/prism-coy.css',
  './public/lib/angular-material/angular-material.css',
  './assets/less/**/*.less'
]

gulp.task('less:compile', function(){
  return gulp.src(cssDependencies)
    .pipe(replace('\\0',''))
    .pipe(concat('styles.css'))
    .pipe(less().on('error', function(err){
      console.error(err);
      this.emit('end');
    }))
    .pipe(gulp.dest('./public/assets/stylesheets/dist/'));
});


gulp.task('coffee:clean', function(){
  return gulp.src(['./public/angular/compiled'], {read: false})
    .pipe(rimraf())
})

gulp.task('coffee:compile', ['coffee:clean'], function(){
  var environment = process.env.NODE_ENV || 'development';
  var configFile = "./public/config/" + environment + ".coffee"

  return gulp.src(['./public/angular/**/*.coffee', configFile])
    .pipe(plumber())
    .pipe(coffee())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/angular/compiled/'));
});

gulp.task('javascript:concat', ['coffee:compile'], function(){
  return gulp.src(['./public/angular/app.js', './public/angular/**/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('application.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/assets/javascripts/dist/'));
});

gulp.task('default', ['bower:concat', 'less:compile', 'javascript:concat']);

gulp.task('webserver', ['static']);

gulp.task('static', ['default'], function(){

  var port = process.env.PORT || process.env.OCTOBLU_FRONTEND_PORT || 8080;
  var apiBackendUri = process.env.OCTOBLU_BACKEND_URI || 'http://localhost:8081/api';

  return gulp.src('./public').pipe(webserver({
    host: '0.0.0.0',
    port: port,
    livereload: false,
    directoryListing: false,
    open: false,
    fallback: 'index.html',
    middleware: [cors()],
    proxies: [{
      source: '/api',
      target: apiBackendUri
    }]
  }));
});

var onChange = function(name) {
  return function(event) {
    console.log(name + ' : ' + event.path + ' was ' + event.type);
  }
}

var watchConfig = { interval: 3000, usePoll: true }

gulp.task('watch', ['static'], function() {
  gulp.watch(['./bower.json'], watchConfig, ['bower'])
    .on('change', onChange('bower'));
  gulp.watch(['./assets/less/**/*.less'], watchConfig, ['less:compile'])
    .on('change', onChange('less'));
  gulp.watch(['./public/angular/!(compiled)/**/*.js', './public/angular/*.js'], watchConfig, ['javascript:concat'])
    .on('change', onChange('concat'));
  gulp.watch(['./public/config/*.coffee','./public/angular/**/*.coffee', './public/angular/*.coffee'], watchConfig, ['coffee:compile', 'javascript:concat'])
    .on('change', onChange('coffee'));
});
