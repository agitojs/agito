'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

var paths = {
  scripts: ['lib/**/*.js'],
  tests: ['test/**/*.js']
};

gulp.task('coverage', function(done) {
  gulp.src(paths.scripts)
    .pipe(istanbul())
    .on('finish', function() {
      gulp.src(paths.tests)
        .pipe(mocha())
        .pipe(istanbul.writeReports({ reporters: ['lcovonly'] }))
        .on('end', done)
      ;
    })
  ;
});

gulp.task('test', function() {
  return gulp.src(paths.tests, { read: false })
    .pipe(mocha())
  ;
});
