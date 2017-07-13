var gulp = require( 'gulp' ),
    less = require( 'gulp-less' ),
    gulp_concat = require( 'gulp-concat' );

// LESS
gulp.task( 'less', function() {
    return gulp.src(
        './css/main.less'
    ).pipe(
        less()
    ).pipe(
        gulp.dest( './dist/style' )
    );
} );

// JS
gulp.task( 'js', function() {
    return gulp.src( [
        './js/*.js',
        './js/**/*.js'
    ] ).pipe(
        gulp_concat( 'main.js' )
    ).pipe(
        gulp.dest( './dist/js/' )
    );
} );

// BUILD
gulp.task( 'build', [ 'less', 'js' ] );

// DEFAULT
gulp.task( 'default', [ 'less', 'js' ], function() {
    gulp.watch( [ './css/**/*.less' ], [ 'less' ] );
    gulp.watch( [ './js/**/*.js' ], [ 'js' ] );
} );
