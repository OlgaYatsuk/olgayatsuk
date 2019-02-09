const gulp   = require('gulp');

gulp.task('watch',
    [
    'styles:watch',
    'copy:watch',
    'images:watch',
    // 'webpack:watch',
    'rollup:watch',
]);
