const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

function handleStreamError(err) {
	const message = err && (err.messageFormatted || err.message) ? (err.messageFormatted || err.message) : err;
	console.error('错误！', message);
	this.emit('end');
}

// 编译 less，并只注入样式，尽量保留当前滚动位置
gulp.task('style', function () {
	return gulp.src('css/*.less')
		.pipe(less())
		.on('error', handleStreamError)
		.pipe(autoprefixer({
			overrideBrowserslist: ['> 1%', 'Firefox >= 10', 'ie >= 9', 'iOS >= 4', 'Chrome >= 10'],
			cascade: false
		}))
		.on('error', handleStreamError)
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.stream({ match: '**/*.css' }));
});

// 编译 JS，编译完成后再刷新页面
gulp.task('script', function () {
	return gulp.src('main.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', handleStreamError)
		.pipe(gulp.dest('js'));
});

// 启动 BrowserSync
gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: './'
		},
		port: 3000,
		cors : true ,
		ghostMode: false,
		notify: false,
		scrollRestoreTechnique: 'window.name'
	});
});

// 监听文件变化
gulp.task('auto', function () {
	// less 变化：只注入 css，不整页刷新，滚动位置最稳
	gulp.watch('css/*.less', ['style']);

	// js 变化：先编译，再整页刷新
	gulp.watch('main.js', ['script']).on('change', browserSync.reload);

	// html 变化：整页刷新，BrowserSync 尽量恢复滚动位置
	gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', function () {
	gulp.start('style', 'script', 'auto', 'serve');
});
