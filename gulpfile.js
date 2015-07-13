// load the plugins
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var minifyCSS   = require('gulp-minify-css');
var rename      = require('gulp-rename');
var jshint      = require('gulp-jshint');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var ngAnnotate  = require('gulp-ng-annotate');
var nodemon     = require('gulp-nodemon');

// task for minifying less files to css
gulp.task('css', function() {
    // grab the less file, process the LESS, save to style.css
    return gulp.src('public/assets/css/style.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/assets/css'));
});

// task for linting js files
gulp.task('lint', function() { 
    return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// task to lint, minify, and concat frontend angular files
gulp.task('angular', function() {
    return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function() {
    // watch the scss file and run the css task
    gulp.watch('public/assets/css/style.scss', ['css']);

    // watch js files and run lint and run js and angular tasks
    gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['lint', 'angular']);
});

// the nodemon task
gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js scss html'
    })
        .on('start', ['watch'])
        .on('change', ['watch'])
        .on('restart', ['watch']);
});

// defining the main gulp task
gulp.task('default', ['nodemon']);
