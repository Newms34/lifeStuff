var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('build/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['build/js/**/*.js','build/js/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('/js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify({mangle:false}))
        .pipe(replace('SLASHu','\\u'))
        .pipe(gulp.dest('js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['build/js/**/*.js','build/js/*.js'], ['lint', 'scripts']);
});

//no watchin!
gulp.task('render',['lint','scripts'])

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);