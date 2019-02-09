const gulp          = require('gulp');
const webpack       = require('webpack');
const gutil         = require('gulp-util');
const notify        = require('gulp-notify');
const server        = require('./server');
const config        = require('../config');
const webpackStream = require('webpack-stream');
const webpackConfig = require('../../webpack.config').createConfig;

const handler = (err, stats, cb) => {
    const errors = stats.compilation.errors;

    if (err) throw new gutil.PluginError('webpack', err);

    if (errors.length > 0) {
        notify.onError({
            title: 'Webpack Error',
            message: '<%= error.message %>',
            sound: 'Submarine'
        }).call(null, errors[0]);
    }

    gutil.log('[webpack]', stats.toString({
        colors: true,
        chunks: false
    }));

    server.reload({stream: true});
    if (typeof cb === 'function') cb();
}

gulp.task('webpack', function(cb) {
    webpack(webpackConfig(config.env)).run(function(err, stats) {
        handler(err, stats, cb);
    });
});

gulp.task('webpack:watch', function() {
    webpack(webpackConfig(config.env)).watch({
        aggregateTimeout: 100,
        poll: false
    }, handler);
});

// gulp.task('webpack:watch', () => {
//   gulp.watch('app/scripts/*.js', () => {
//     return gulp.src('app/scripts/*.js')
//       .pipe(webpackStream(webpackConfig(config.env), webpack))
//       .pipe(gulp.dest('dist/'))
//       .pipe(server.reload({stream: true}));
//     })
// });

  // gulp.watch('app/scripts/**.*', ['webpack']);

  // .pipe(webpackStream(webpackConfig(config.env), webpack().run(function(err, stats) {
    // handler(err, stats, cb);
// })))
  // return gulp.src('app/scripts/**.*')
  // .pipe(webpackStream(webpackConfig(config.env), webpack))
  // .pipe(gulp.dest('dist'))
