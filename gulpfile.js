const gulp = require('gulp');
const cached = require('gulp-cached');
const ts = require('gulp-typescript');
const tslint = require("gulp-tslint");

const src = {
  ts: ['src/**/*.ts', '!src/www/**/*', '!src/typing/**/*'],
  others: ['src/**/*', '!src/www/**/*', '!src/**/*.ts']
};
const dest = 'public';

gulp.task('tslint', () => {
  return gulp.src(src.ts)
    .pipe(cached('tslint', { optimizeMemory: true }))
    .pipe(tslint({ formatter: 'verbose' }))
    .pipe(tslint.report({ emitError: false }));
});

gulp.task('ts', () => {
  return gulp.src(src.ts)
    .pipe(cached('ts', { optimizeMemory: true }))
    .pipe(ts())
    .pipe(gulp.dest(dest));
});

gulp.task('copy:others', () => {
  return gulp.src(src.others)
    .pipe(cached('others', { optimizeMemory: true }))
    .pipe(gulp.dest(dest));
});

gulp.task('watch', () => gulp.watch([].concat(src.ts, src.others), gulp.series('tslint', 'ts', 'copy:others')));
gulp.task('default', gulp.series('tslint', 'ts', 'copy:others'));
