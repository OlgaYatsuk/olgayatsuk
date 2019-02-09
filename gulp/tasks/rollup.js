const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const commonJs = require('rollup-plugin-commonjs');
const resolveNodeModules = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const alias = require('rollup-plugin-alias');
const inject = require('rollup-plugin-inject');
const uglify = require('rollup-plugin-uglify').uglify;
const config        = require('../config');
const server        = require('./server');

const debug = require('debug');
const log = debug('app:log');

// The logger should only be disabled if we’re not in production.
if (config.env !== 'production') {

  // Enable the logger.
  // debug.enable('*');
  // log('Logging is enabled!');
} else {
  // debug.disable();
}


const babelConfig = {
  "presets": [
    ["env", {
      "modules": false
    }],
    "stage-0",
  ],
  "plugins": [
    "external-helpers"
  ],
  //   [
  //     "es2015",
  //     {
  //       "modules": false
  //     }
  //   ]
  // ],
  // "plugins": [
  //   "external-helpers"
  // ],
  babelrc: false,
  exclude: 'node_modules/**'
};

const resolveConfig = {
  jsnext: true,
  main: true,
  browser: true,
  preferBuiltins: false,
  external: [ 'source-map' ]
}

/**
 * Use rollup in gulp making it compatible with streams
 * @param {String} inputFile path to main JS file
 * @param {Object} options configuration object containing format, basePath, und distPath
 * @return {Function}
 */
const rollupJS = (inputFile, options) => {
  return () => {
    return rollup({
      input: options.basePath + inputFile,
      format: options.format,
      sourcemap: options.sourcemap,
      // add the plugin configuration
      plugins: [
        resolveNodeModules(resolveConfig),
        commonJs({namedExports: {
          // left-hand side can be an absolute path, a path
          // relative to the current directory, or the name
          // of a module in node_modules
          'node_modules/three/build/three.module.js': [ 'OBJLoader' ]
        }}),
        babel(babelConfig),
        replace({
          exclude: 'node_modules/**',
          ENV: JSON.stringify(config.env || 'development'),
        }),
        (process.env.NODE_ENV === 'production' && uglify()),
        alias({
          // somelibrary: './mylocallibrary'
        }),
        inject({
          // control which files this plugin applies to
          // with include/exclude
          include: '**/*.js',
          exclude: 'node_modules/**',

          /* all other options are treated as modules...*/

          // use the default – i.e. insert
          // import $ from 'jquery'
          $: 'jquery',
          jQuery: 'jquery',

          // use a named export – i.e. insert
          // import { Promise } from 'es6-promise'
          // Promise: [ 'es6-promise', 'Promise' ],

          // use a namespace import – i.e. insert
          // import * as fs from 'fs'
          fs: [ 'fs', '*' ],

          // use a local module instead of a third-party one
          // 'Object.assign': path.resolve( 'src/helpers/object-assign.js' ),

          /* ...but if you want to be careful about separating modules
             from other options, supply `options.modules` instead */

          modules: {
            $: 'jquery',
            jQuery: 'jquery',
            // Promise: [ 'es6-promise', 'Promise' ],
            // 'Object.assign': path.resolve( 'src/helpers/object-assign.js' )
          }
        })
      ],
      external: [ 'source-map' ],
    })
    // point to the entry file.
    .pipe(source(inputFile, options.basePath))
    // we need to buffer the output, since many gulp plugins don't support streams.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // some transformations like uglify, rename, etc.
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.distPath))
    .pipe(server.reload({stream: true}));
  };
}

/**
 * Bundle JS files starting from main.js
 */
gulp.task('rollup', rollupJS('app.js', {
  basePath: './app/scripts/',
  // format: 'iife',
  format: 'cjs',
  distPath: './dist/scripts/',
  sourcemap: true
}));

// gulp.task('rollup:watch', ['rollup']);
gulp.task('rollup:watch', function() {
  gulp.watch('app/scripts/**.*', ['rollup']);
});

