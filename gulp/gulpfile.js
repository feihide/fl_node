var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  p = gulpLoadPlugins();
// 合并文件之后压缩代码
gulp.task('minify', function() {
  return gulp.src('src/*.js')
    .pipe(p.jshint())
    .pipe(p.jshint.reporter('default'))
    .pipe(p.concat('m.js'))
    //        .pipe(gulp.dest('dist/js'))
    .pipe(p.uglify({
      mangle: true,
      mangleProperties: true
    })) //去注释无效
    .pipe(p.rename('m.min.js'))
    //.pipe(p.obfuscate())
    .pipe(gulp.dest('dist/js'))
    .pipe(p.notify({
      message: 'Scripts task complete'
    }));
});

// 监视文件的变化
gulp.task('watch', function() {
  gulp.watch('src/*.js', ['minify']);
  gulp.watch('images/**/*', ['images']);
});

gulp.task('images', function() {
  return gulp.src('images/**/*')
    .pipe(p.cache(p.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
    .pipe(p.notify({
      message: 'Images task complete'
    }));
});
gulp.task('clean', function() {
  return gulp.src(['dist/js'], {
    read: false
  })
    .pipe(p.clean());
});
// 注册缺省任务
gulp.task('default', ['clean'], function() {
  gulp.start('images', 'minify', 'watch');
});
