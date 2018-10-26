let gulp = require('gulp');
let watch = require('gulp-watch');
let babel = require('gulp-babel');
gulp.task('watch', () => {
    return gulp.src('wal.js')
        .pipe(watch('wal.js', {
            verbose: true
        }))
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});
gulp.task('transform', () => {
    return gulp.src('src/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist/server'));
});