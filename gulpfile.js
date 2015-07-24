var gulp      = require('gulp'),
    sh        = require('shelljs'),
    del       = require('del'),
    sass      = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    uglify    = require('gulp-uglify'),
    gulpif    = require('gulp-if'),
    useref    = require('gulp-useref'),
    connect   = require('gulp-connect');

gulp.task('default', ['copy']);

gulp.task('copy', ['useref'], function() {
  return gulp.src([
    'app/img/**',
    'app/lib/ionic/fonts/**',
    'app/lib/ionic/js/ionic.bundle.js',
    'app/templates/**'
    ], {base: 'app'})
    .pipe(gulp.dest('www'));
});

gulp.task('copy:dev', ['useref:dev'], function() {
  return gulp.src([
    'app/{img,lib,templates}/**'
    ], {base: 'app'})
    .pipe(gulp.dest('www'));
});

gulp.task('useref', ['clean', 'sass'], function() {
  var assets = useref.assets();

  return gulp.src([
    'app/*.html',
    ])
    .pipe(assets)
    .pipe(gulpif('*.js', uglify({mangle: false})))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('www'));
});

gulp.task('useref:dev', ['clean', 'sass'], function() {
  var assets = useref.assets();

  return gulp.src([
    'app/*.html'
    ])
    .pipe(assets)
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('www'));
});

gulp.task('sass', ['clean'], function() {
  return gulp.src([
    'scss/ionic.app.scss',
    'app/scss/**/*.scss'
    ])
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(gulp.dest('.tmp/css'));
});

gulp.task('clean', function(done) {
  del(['www', '.tmp', 'app/css'], done);
});

gulp.task('build', ['copy'], function() {
  sh.exec('cordova build android');
});

gulp.task('serve', function() {
  connect.server({
    root: 'www',
    port: 3000
  });
});

gulp.task('watch', ['copy:dev'], function() {
  return gulp.watch([
    'app/{img,js,scss,templates}/**/*',
    'app/index.html'
  ], ['copy:dev']);
});

gulp.task('watch_self', ['sass'], function() {
  return gulp.watch(['app/scss/**/*'], ['sass']);
});