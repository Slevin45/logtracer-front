var gulp  = require('gulp');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'uglify-save-license', 'del']
});

gulp.task('js', ['jshint'], function() {
    return gulp.src([
            'src/{app,components}/**/*.js',
            '!src/{app,components}/**/*.spec.js',
            '!src/{app,components}/**/*.mock.js'
        ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.min.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('src/scripts'));
});

gulp.task('partials', function () {
    return gulp.src('src/{app,components}/**/*.html')
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'loyaltySystem'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('html', ['revision'], function() {
    return gulp.src('src/*.html')
        .pipe($.revReplace({manifest: gulp.src('.tmp/rev-manifest.json')}))
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('jsmin', ['jshint', 'partials'], function() {
    return gulp.src([
            'src/{app,components}/**/*.js',
            '.tmp/templateCacheHtml.js',
            '!src/{app,components}/**/*.spec.js',
            '!src/{app,components}/**/*.mock.js'
        ])
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe($.concat('app.min.js'))
        .pipe(gulp.dest('.tmp/dist/scripts'));
});

gulp.task('revision', ['jsmin'], function() {
    return gulp.src(['.tmp/dist/**/*.js'])
        .pipe($.rev())
        .pipe(gulp.dest('dist'))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('.tmp'));
});

gulp.task('jshint', function () {
    return gulp.src('src/{app,components}/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.notify(function (file) {
            if (file.jshint.success) {
                return false;
            }
            var errors = file.jshint.results.map(function (data) {
                if (data.error) {
                    return '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
                }
            }).join('\n');
        return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
    }));
});

/*================================================================*/

gulp.task('build', ['html']);

gulp.task('default', ['clean', 'build']);

gulp.task('watch', ['js'], function () {
    gulp.watch('src/{app,components}/**/*.js', ['js']);
});

gulp.task('clean', function (done) {
    $.del(['dist/', '.tmp/','src/scripts/'], done);
});
