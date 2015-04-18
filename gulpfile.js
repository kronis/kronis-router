var gulp = require('gulp');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var buster = require("gulp-busterjs");

// Start server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('connect', function() {
    connect.server({
        root: './'
    });
});

gulp.task('clean', function() {
    return gulp.src(['./test/dist'])
        .pipe(clean({
            force: true
        }));
});

gulp.task('browserify', function(done) {
    // Single entry point to browserify
    return gulp.src('./js/router.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(gulp.dest('./js/dist'));
});

gulp.task("test", function() {
    gulp
        .src("./test/**/*-test.js")
        .pipe(buster({
            name: "my lovely configuration name", // default: "testrun 123"
            environment: "browser", // default: "node"
            // rootPath: "my/tests", // default: process.cwd()
            tests: [], // default: the gulp files
            failOnStderr: false, // default: true
            transformSpawnArgs: function(args) {
                return args;
            }
        }));
});

// Build for testing
gulp.task('default', ['browser-sync'], function() {
    gulp.watch('./index.html').on('change', browserSync.reload);
    gulp.watch('./css/*.css').on('change', browserSync.reload);
    gulp.watch('./js/*.js').on('change', browserSync.reload);
});
