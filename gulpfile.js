console.debug = console.log;
var map = require('map-stream');

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    coffee = require('gulp-coffee'),
    fs = require('fs'),
    open = require('open'),
    mocha = require('gulp-mocha'),
    es = require('event-stream'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    filter = require('gulp-filter'),
    clean = require('gulp-clean');

var
    livereloadport = 35729,
    serverport = 5000;

/** webpack **/
    webpackConfig = require('./webpack.config.js');


gulp.task('clean', function() {
    gulp.src(['dist','output'], {read: false})
        .pipe(clean());
});

//Task for sass using libsass through gulp-sass
gulp.task('sass', function () {
  return gulp.src('sass/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});

//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function () {
  return gulp.src('app/**/*.html')
      .pipe(embedlr())
      .pipe(gulp.dest('dist/static'))
      .pipe(refresh(lrserver));
});

//Convenience task for running a one-off build
gulp.task('build', function () {
  return gulp.run('html', 'sass');
});

gulp.task('server', function () {
  return gulp.src('server/src/**/*.coffee')
      .pipe(coffee()).on('error', gutil.log)
      .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-app', function () {

  //Add watching on sass-files
  gulp.watch('app/sass/*.scss', function () {
    gulp.run('sass');
  });

  gulp.watch(['app/**/*.js','app/**/*.coffee'], function () {
    gulp.src('app/**/*.html')
        .pipe(refresh(lrserver));
  });
});

gulp.task('watch-server', function () {
  gulp.watch(['server/src/**/*.js', 'server/src/**/*.coffee'], function () {
    gulp.run('server');
  });

  //Add watching on html-files
  gulp.watch('app/**/*.html', function () {
    gulp.run('html');
  });

});

gulp.task('watch-server-test', function () {
  gulp.watch(['server/**/*.js', 'server/**/*.coffee', 'server/test/**/*'], function () {
    gulp.run('server-test');
  });
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('server-test', function () {
  es = require("event-stream");
  return es.concat(
          gulp.src('server/src/**/*.coffee').pipe(coffee()).on('error', gutil.log),
          gulp.src(['server/src/**/*.js', 'server/test/**/*']))
      .pipe(filter('!index.js'))
      .pipe(gulp.dest('output/testsrc'))
      .pipe(mocha({reporter: 'nyan'})).on('error', handleError);
});

var nodemon = require('gulp-nodemon');


gulp.task('webpack:build', function (callback) {

  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify("production")
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, function (err, stats) {
    if (err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("webpack-dev-server", function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.watch = true;
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    contentBase: "./app/",
    noInfo: true,
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
      });
  open('http://localhost:8080/webpack-dev-server/index.html');

});

gulp.task("webpack-test-server", function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.watch = true;
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    contentBase: "./app/test",
    noInfo: true,
    stats: {
      colors: true
    }
  }).listen(8081, "localhost", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
      });
  open('http://localhost:8081/webpack-dev-server/index.html');
});

gulp.task('serve',['build','server'], function () {
  nodemon({ script: 'dist/index.js', env:{'NODE_ENV':'development', 'STATIC_ROOT':"./dist/static"}, options: '--watch dist/*.js --ignore dist/tests.js' }).on('start', 'nodemon-open');

  console.log("Live reload server listening on port " + livereloadport);
  lrserver.listen(livereloadport);
});

// We only want to open browser on first start
var localhost_open = false;
gulp.task('nodemon-open', function () {
  !localhost_open && (localhost_open=true) && open('http://localhost:5000/');
});

gulp.task('dev', ['watch-server','webpack-dev-server', 'serve', 'watch-app', 'webpack-test-server', 'server-test','watch-server-test'], function () {
});

gulp.task('default', function () {
  /*todo remove usage of run. */
  gulp.run('build', 'serve', 'watch-server', 'open', 'server-test');
});

gulp.task('dist',['build','server','webpack:build'], function () {

});