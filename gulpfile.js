const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const https = require('https');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const localCssPath = 'css';  // 保存CSS文件的路径
const localAssetsPath = 'fonts';  // 保存字体引用文件的路径

// 编译less文件，添加CSS前缀并刷新浏览器的任务
gulp.task('style', function () {
	gulp.src('css/*.less')
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['> 1%', 'Firefox >= 10', 'ie >= 9', 'iOS >= 4', 'Chrome >= 10'],
			cascade: false
		}))
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.stream());

	gulp.src('./*.html')
		.pipe(browserSync.stream());

	gulp.src('main.js')
		.pipe(babel({
			"presets": ["es2015"]
		}))
		.on('error', function (err) {
			console.error('错误！', err.message);
			this.emit('end');
		})
		.pipe(gulp.dest('js'))
		.pipe(browserSync.stream());
});

// 启动BrowserSync服务器的任务
gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: './'
		},
	});
});

// 监听文件变化，并运行'style'任务的任务
gulp.task('auto', function () {
	gulp.watch('css/*.less', ['style']);
	gulp.watch('main.js', ['style']);
	gulp.watch('./*.html', ['style']);
});

// 下载CSS文件，并下载字体文件的任务
gulp.task('download-css', function (done) {
	extractCssUrl('index.html').then(function (remoteCssFile) {
		if (remoteCssFile) {
			https.get(remoteCssFile, function (res) {
				var filePath = path.join(localCssPath, path.basename(remoteCssFile));
				var fileStream = fs.createWriteStream(filePath);
				res.pipe(fileStream);
				fileStream.on('finish', function () {
					fileStream.close(function () {
						downloadAssets(remoteCssFile).then(function () {
							done();
						}).catch(function (err) {
							console.error('下载字体文件失败:', err);
							done(err);
						});
					});
				});
			}).on('error', function (err) {
				console.error('下载图标CSS文件失败:', err.message);
				done(err);
			});
		} else {
			done('index.html未找到');
		}
	}).catch(function (err) {
		console.error('提取图标链接出错:', err);
		done(err);
	});
});

// 解析HTML文件中的CSS链接的函数
function extractCssUrl(htmlFilePath) {
	return new Promise(function (resolve, reject) {
		fs.readFile(htmlFilePath, 'utf8', function (err, data) {
			if (err) {
				reject(err);
				return;
			}
			const regex = /<link\s+[^>]*id="iconfont"\s+[^>]*href="([^"]*)"/g;
			const match = regex.exec(data);
			if (match && match[1]) {
				var originalUrl = match[1];
				try {
					var url;
					if (originalUrl.startsWith('//')) {
						url = new URL('https:' + originalUrl); // 在链接前加上 https:
					} else {
						url = new URL(originalUrl); // 解析原始 URL
					}
					var localUrl = 'css/' + path.basename(url.pathname) + url.search; // 构建本地路径

					var updatedHtml = data.replace(originalUrl, localUrl);
					fs.writeFileSync(htmlFilePath, updatedHtml, 'utf8');

					resolve(url.href);
				} catch (error) {
					reject('无效的链接格式: ' + originalUrl);
				}

			} else {
				reject('在index.html中未找到link#iconfont');
			}
		});
	});
}

// 下载CSS文件中引用的字体文件的函数
function downloadAssets(remoteCssFile) {
	return new Promise(function (resolve, reject) {
		var cssFilePath = path.join(localCssPath, path.basename(remoteCssFile));
		var cssContent = fs.readFileSync(cssFilePath, 'utf8');
		var urlRegex = /url\(([^)]+)\)/g;
		var match;
		var urls = [];
		var updatedCssContent = cssContent;

		while ((match = urlRegex.exec(cssContent)) !== null) {
			var url = match[1].replace(/['"]/g, '');
			if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
				if (url.startsWith('//')) {
					url = 'https:' + url;
				}
				urls.push(url);
			}
		}

		var downloadPromises = urls.map(function (url) {
			var urlPath = new URL(url).pathname;
			var fileName = path.basename(urlPath);
			var filePath = path.join(localAssetsPath, fileName);

			return new Promise(function (resolve, reject) {
				if (fs.existsSync(filePath)) {
					resolve(null);
				} else {
					if (url.startsWith('data:')) {
						var base64Data = url.split(',')[1];
						var buffer = Buffer.from(base64Data, 'base64');
						fs.writeFileSync(filePath, buffer);
						resolve(filePath);
					} else {
						https.get(url, function (res) {
							var fileStream = fs.createWriteStream(filePath);
							res.pipe(fileStream);
							fileStream.on('finish', function () {
								fileStream.close(resolve(filePath));
							});
						}).on('error', function (err) {
							console.error('字体文件下载失败', err.message);
							reject(err);
						});
					}
				}
			});
		});

		Promise.all(downloadPromises)
			.then(function (results) {
				while ((match = urlRegex.exec(cssContent)) !== null) {
					var originalUrl = match[1].replace(/['"]/g, '');  // 移除引号
					if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://') || originalUrl.startsWith('//')) {
						// 检查是否是 HTTP 协议，如果是，则替换为本地路径
						var url = new URL(originalUrl, remoteCssFile); // 解析原始 URL
						var localUrl = '../fonts/' + path.basename(url.pathname) + url.search; // 构建本地路径

						updatedCssContent = updatedCssContent.replace(originalUrl, `${localUrl}`);
					}
				}

				fs.writeFileSync(cssFilePath, updatedCssContent, 'utf8');
				resolve();
			})
			.catch(function (err) {
				console.error('文件下载失败:', err);
				reject(err);
			});
	});
}

gulp.task('default', function () {
	gulp.start('download-css', 'auto', 'style', 'serve');
});
