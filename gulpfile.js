var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var open = require('gulp-open');

gulp.task('scripts', function () {
  return browserify('./js/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('html', function () {
  return gulp.src('./*.html')
    .pipe(gulp.dest('./build'))
});

gulp.task('watch', function () {
  gulp.watch('./js', ['scripts']);
  gulp.watch('./*.html', ['html']);
});

gulp.task('open', function () {
  var opts = {
    app: 'google chrome'
  };

  return gulp.src('./build/index.html')
    .pipe(open('./build/index.html', opts));
});

gulp.task('default', ['scripts', 'html', 'watch', 'open']);
