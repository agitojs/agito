'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

var paths = {
  gulpfile: 'gulpfile.js',
  scripts: 'lib/**/*.js',
  tests: 'test/**/*.js'
};

gulp.task('coverage', function(done) {
  gulp.src([paths.scripts])
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src([paths.tests])
        .pipe(mocha())
        .pipe(istanbul.writeReports({ reporters: ['lcovonly'] }))
        .on('end', done)
      ;
    })
  ;
});

gulp.task('lint', function() {
  return gulp.src([paths.gulpfile, paths.scripts, paths.tests])
    .pipe(jshint())
    .pipe(jscs())
  ;
});

gulp.task('test', function() {
  return gulp.src([paths.tests], { read: false })
    .pipe(mocha())
  ;
});

gulp.task('default', ['lint', 'test']);
