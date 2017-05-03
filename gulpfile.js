const gulp = require('gulp');
const cached = require('gulp-cached');
const ts = require('gulp-typescript');
const tslint = require("gulp-tslint");

const src = {
  ts: ['src/**/*.ts', '!src/www/**/*', '!src/typing/**/*'],
  sql: ['src/**/*.sql']
};
const dest = 'public';

gulp.task('tslint', () => {
  return gulp.src(src.ts)
    .pipe(cached('tslint', { optimizeMemory: true }))
    .pipe(tslint({ formatter: 'verbose' }))
    .pipe(tslint.report())
});

gulp.task('ts', () => {
  return gulp.src(src.ts)
    .pipe(cached('ts', { optimizeMemory: true }))
    .pipe(ts())
    .pipe(gulp.dest(dest));
});

gulp.task('copy:sql', () => {
  return gulp.src(src.sql)
    .pipe(cached('sql', { optimizeMemory: true }))
    .pipe(gulp.dest(dest));
});

gulp.task('watch', () => gulp.watch([].concat(src.ts, src.sql), gulp.series('tslint', 'ts', 'copy:sql')));
gulp.task('default', gulp.series('tslint', 'ts', 'copy:sql'));
