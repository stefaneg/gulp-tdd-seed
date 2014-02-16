console.debug = console.log;
var map = require('map-stream');

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  embedlr = require('gulp-embedlr'),
  refresh = require('gulp-livereload'),
  lrserver = require('tiny-lr')(),
  express = require('express'),
  livereload = require('connect-livereload'),
    coffeescript = require('gulp-coffee'),
    fs = require('fs'),
    livereloadport = 35729,
  serverport = 5000;

//We only configure the server here and start it only when running the watch task
//var server = express();
//Add livereload middleware before static-middleware
//server.use(livereload({
//  port: livereloadport
//}));
//server.use(express.static('./dist'));

//Task for sass using libsass through gulp-sass
gulp.task('sass', function(){
  return gulp.src('sass/*.scss')
    .pipe(sass())
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});

//Task for processing js with browserify
gulp.task('browserify', function(){
  return gulp.src('app/src/*.js')
      .pipe(browserify())
   .pipe(concat('dest.js'))
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});

//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function(){
  return gulp.src('app/**/*.html')
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});

//Convenience task for running a one-off build
gulp.task('build', function() {
  return gulp.run('html', 'browserify', 'sass');
});

gulp.task('server', function () {
  return gulp.src('server/**/*.coffee')
      .pipe(coffeescript())
      .pipe(gulp.dest('./dist/'));
});

var expressServer;

gulp.task('serve', ['server'], function () {
  //Add livereload middleware before static-middleware
  //Set up your static fileserver, which serves files in the build dir
  var apiServer = require('./dist/server');
  expressServer = apiServer(function (server) {
    server.use(livereload({
      port: livereloadport
    }));

  });

  expressServer.listen(serverport);

  //Set up your livereload server
  lrserver.listen(livereloadport);
});

gulp.task('watch', function() {

  //Add watching on sass-files
  gulp.watch('app/sass/*.scss', function () {
    gulp.run('sass');
  });

  //Add watching on js-files
  gulp.watch('app/**/*.js', function() {
    gulp.run('browserify');
  });

  //Add watching on html-files
  gulp.watch('app/**/*.html', function () {
    gulp.run('html');
  });
});

gulp.task('default', function () {
  gulp.run('build', 'serve', 'watch');
});


var nodemon = require('gulp-nodemon');

gulp.task('develop', function () {
  nodemon({ script: 'dist/server.js', options: '-e html,js -i ignored.js' })
    .on('restart', ['lint'])
})