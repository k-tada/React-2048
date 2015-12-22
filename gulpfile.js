var gulp = require('gulp');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

gulp.task('sass', function(){
    gulp.src('./assets/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('browserify', function() {
  browserify({
    entries: './js/app.js',
    extensions: ['.js']
    })
    .transform('babelify', { presets: ['es2015', 'react'], plugins: ["transform-runtime"] })
    .bundle()
    .on('error', function(err) { console.log(err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./js/'))
});

gulp.task('watch', ['browserify', 'sass'], function() {
  gulp.watch('./js/components/**/*.js', ['browserify']);
  gulp.watch('./assets/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);
