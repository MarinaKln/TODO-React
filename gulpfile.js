var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass');


// server connect
gulp.task('connect', function() {
    connect.server({
        root: '',
        livereload: true
    });
});

//html
gulp.task('html', function() {
    gulp.src('index.html')
    .pipe(connect.reload());
});

// css
gulp.task('css', function () {
    return gulp.src('style/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS(''))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('style/css'))
        .pipe(connect.reload());
});

// watch
gulp.task("watch", function() {
     gulp.watch("style/*.scss", ["css"])
     gulp.watch("index.html", ["html"])
});

// default
gulp.task('default', ['connect', 'html', 'css', 'watch' ]);

