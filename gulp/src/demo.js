/*ddddddddd*/
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var    cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var    clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
// 语法检查
gulp.task('jshint', function () {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
// 合并文件之后压缩代码
gulp.task('minify', function (){
    return gulp.src('src/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// 监视文件的变化
gulp.task('watch', function () {
    gulp.watch('src/*.js', ['jshint', 'minify']);
});

// 注册缺省任务
gulp.task('default', ['jshint', 'minify', 'watch']);