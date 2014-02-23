console.debug = console.log;
var map = require('map-stream');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    coffee = require('gulp-coffee'),
    fs = require('fs'),
    open = require('open'),
    streamqueue = require('streamqueue'),
    livereloadport = 35729,
    serverport = 5000;

//Task for sass using libsass through gulp-sass
gulp.task('sass', function(){
  return gulp.src('sass/*.scss')
    .pipe(sass())
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});


gulp.task('clientcoffee', function () {
  return gulp.src('app/src/**/*.coffee')
      .pipe(coffee()).on('error', gutil.log)
      .pipe(gulp.dest('./.tmp/clientcoffee'));
});

//Task for processing js with browserify
gulp.task('browserify', function(){
return streamqueue({ objectMode: true },
        gulp.src('app/src/**/*.js'),
        gulp.src('app/src/**/*.coffee')
          .pipe(coffee()).on('error', gutil.log)
    )
      .pipe(concat('dest.js'))
      .pipe(browserify())
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));

});

//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function(){
  return gulp.src('app/**/*.html')
      .pipe(embedlr())
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});

//Convenience task for running a one-off build
gulp.task('build', function() {
  return gulp.run('html', 'browserify', 'sass');
});

gulp.task('server', function () {
  return gulp.src('server/**/*.coffee')
      .pipe(coffee()).on('error', gutil.log)
      .pipe(gulp.dest('./dist/'));
});

var expressServer;

gulp.task('serveEXPRESS', ['server'], function () {
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

  gulp.watch('server/**/*.coffee', function () {
    gulp.run('server');
  });
});

gulp.task('open', function(){
  open('http://localhost:5000/');
});

gulp.task('default', function () {
  gulp.run('build', 'serve', 'watch', 'open');
});

var nodemon = require('gulp-nodemon');

gulp.task('serve',['server'], function () {
  nodemon({ script: 'dist/index.js', options: '-e dist/html,dist/js -i ignored.js' });

  lrserver.listen(livereloadport);

  console.log("Live reload server listening on port " + livereloadport);

});