
var gulp = require('gulp');
var concat = require('gulp-concat');


gulp.task('js', function () {
    gulp.src([
       // 'app/**/*.js'
        'app/app.module.js',
        'app/app.service.js',
        'app/app.routes.js',
        'app/components/**/*.js',
        'app/layout/**/*.js'
    ])
        .pipe(concat('app.module.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', ['js'], function () {
    gulp.watch('app/**/*.js', ['js'])

});