var gulp    = require('gulp'),
    sh      = require('shelljs'),
    del     = require('del');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['build']);

gulp.task('build', ['copy'], function() {
  sh.exec('cordova build android');
});

gulp.task('copy', ['clean'], function(done) {
  gulp.src('app/**')
    .pipe(gulp.dest('www'))
    .on('end', done);
});

gulp.task('clean', function(done) {
  del('www', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

