const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const bs = require('browser-sync').create();
const del = require('del');

gulp.task('serv', () => {
  bs.init({
    server: {
      baseDir: './dist/'
    }
  });
});

gulp.task('htmlmin', () => {
  return gulp
    .src('./app/*.html')
    .pipe(
      plumber({
        errorHandler: notify.onError(err => {
          return {
            title: 'HTML Error',
            message: err.message
          };
        })
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./dist/'))
    .pipe(bs.stream());
});

gulp.task('css', () => {
  let processors = [cssnext, cssnano];

  return gulp
    .src(['./app/css/sprite.css', './app/css/styles.css'])
    .pipe(
      plumber({
        errorHandler: notify.onError(err => {
          return {
            title: 'CSS Error',
            message: err.message
          };
        })
      })
    )
    .pipe(postcss(processors))
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(bs.stream());
});

gulp.task('js', () => {
  return gulp
    .src('./app/js/**/*.js')
    .pipe(
      plumber({
        errorHandler: notify.onError(err => {
          return {
            title: 'JS Error',
            message: err.message
          };
        })
      })
    )
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(bs.stream());
});

gulp.task('sprite', () => {
  let spriteData = gulp.src('./app/img/images/*.png').pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 20,
      imgPath: '../img/sprites/sprite.png'
    })
  );

  let imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img/sprites/'));

  let cssStream = spriteData.css.pipe(gulp.dest('./app/css/'));

  return merge(imgStream, cssStream);
});

gulp.task('move-fonts', () => {
  gulp.src('./app/fonts/*').pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('emoji-json', () => {
  gulp
    .src('./node_modules/emoji.json/emoji.json')
    .pipe(rename('emoji.json'))
    .pipe(gulp.dest('./dist/data/'));
});

gulp.task('clean-dist', () => {
  return del.sync('dist');
});

gulp.task('watch', () => {
  gulp.watch('./app/*.html', ['htmlmin']);
  gulp.watch('./app/css/**/*.css', ['css']);
  gulp.watch('./app/js/**/*.js', ['js']);
});

gulp.task('build', [
  'htmlmin',
  'css',
  'js',
  'sprite',
  'move-fonts',
  'emoji-json'
]);

gulp.task('default', ['serv', 'htmlmin', 'css', 'js', 'emoji-json', 'watch']);
