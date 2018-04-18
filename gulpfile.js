const gulp          = require('gulp')
const runSequence   = require('run-sequence')
const sass          = require('gulp-sass')
const babel         = require('gulp-babel')

var distFolder = './static/css';

gulp.task('build:sass', function () {
    return gulp.src('./scss/main.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest(distFolder))
});

gulp.task('watch:sass', function () {
    return gulp.watch('./scss/**/*.scss', ['build:sass'])
});

gulp.task('build:js', function() {
    return gulp.src('./js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('bundle.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/js'))
})

/* MAIN GULP TASKS */
gulp.task('default', function(cb) {
    runSequence('build:sass', cb)
});

gulp.task('watch', function(cb) {
    runSequence('build:sass', 'watch:sass', cb)
});
