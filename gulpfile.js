/* eslint-disable node/no-unpublished-require */
const gulp = require("gulp");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const del = require("del");
/* eslint-enable node/no-unpublished-require */
//Порядок подключения css файлов
const cssFiles = ["./dev/scss/**/*.scss"];
//Порядок подключения js файлов
const jsFiles = ["./dev/js/**/*.js"];

const dels = [
  "./pablic/javascripts/scripts.js",
  "./pablic/staylesheets/styles.css"
];
//Таск на стили CSS
function styles() {
  //Шаблон для поиска файлов CSS
  //Всей файлы по шаблону './src/css/**/*.css'
  return (
    gulp
      .src(cssFiles)
      //Объединение файлов в один
      .pipe(concat("styles.css"))
      //Добавить префиксы
      .pipe(sass())
      .pipe(plumber())
      //Минификация CSS
      .pipe(
        autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
          cascade: true
        })
      )
      .pipe(cssnano())
      .pipe(
        cleanCSS({
          level: 2
        })
      )
      //Выходная папка для стилей
      .pipe(gulp.dest("./pablic/staylesheets"))
  );
}

//Таск на скрипты JS
function scripts() {
  //Шаблон для поиска файлов JS
  //Всей файлы по шаблону './src/js/**/*.js'
  return (
    gulp
      .src(jsFiles)
      //Объединение файлов в один
      .pipe(concat("scripts.js"))
      //Минификация JS
      .pipe(
        uglify({
          toplevel: true
        })
      )
      //Выходная папка для скриптов
      .pipe(gulp.dest("./pablic/javascripts"))
  );
}
function watch() {
  gulp.watch("./dev/scss/**/*.scss", styles);
  gulp.watch("./dev/js/**/*.js", scripts);
}
//Удалить всё в указанной папке
function clean() {
  return del(dels);
}

//Таск вызывающий функцию styles
gulp.task("styles", styles);
//Таск вызывающий функцию scripts
gulp.task("scripts", scripts);
gulp.task("watch", watch);
gulp.task("del", clean);

//Таск для удаления файлов в папке build и запуск styles и scripts
gulp.task("build", gulp.series(clean, gulp.parallel(styles, scripts)));

gulp.task("dev", gulp.series("build", "watch"));
