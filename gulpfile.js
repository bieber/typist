/*
 * Copyright Robert Bieber, 2014
 *
 * This file is part of typist.
 *
 * typist is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * typist is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with typist.  If not, see <http://www.gnu.org/licenses/>.
 */

var gulp = require('gulp');
var util = require('gulp-util');
var browserify = require('gulp-browserify');
var _ = require('reactify');

gulp.task('build', function() {
    gulp.src('./js/init.js', {read: false})
        .pipe(browserify({
            transform: ['reactify'],
            extensions: ['.js']
        }))
        .on('error', util.log)
        .on('error', util.beep)
        .pipe(gulp.dest('./build/'));
    gulp.src('./html/**/*.html')
        .pipe(gulp.dest('./build/'));
    gulp.src('./css/**/*.css')
        .pipe(gulp.dest('./build/'));
});


gulp.task('watch', function() {
    gulp.watch('./js/**/*.js', ['build']);
    gulp.watch('./html/**/*.html', ['build']);
    gulp.watch('./css/**/*.css', ['build']);
});

gulp.task('default', ['build', 'watch'])
