/**
 * Created by yave on 6/04/16.
 */
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var ngConstant = require('gulp-ng-constant');

gulp.task('config', function () {
    gulp.src(path.join(conf.paths.src, '/app/index.constants.json'))
        .pipe(ngConstant({
            templatePath: 'gulp/index.constants.tpl'
        }))
        .pipe(gulp.dest(path.join(conf.paths.src, '/app')));
});