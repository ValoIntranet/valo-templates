var gulp = require("gulp"),
  gutil = require("gulp-util"),
  fs = require("fs"),
  concat = require("gulp-concat"),
  path = require("path"),
  merge = require("merge-stream"),
  ts = require("gulp-typescript"),
  watch = require("gulp-watch"),
  sass = require("gulp-sass");
var spsync = require("gulp-spsync-creds").sync;
var tsProject = ts.createProject("tsconfig.json");
sass.compiler = require("node-sass");
var argv = require('yargs').argv;;

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source =>
  fs
    .readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);
getComponentNameFromDirectory = directory => {
  const directoryNameRegex = /[\/\\]+([\w\d_-]+)$/gm;
  const componentName = directoryNameRegex.exec(directory)[1];
  return componentName;
};
gulp.task("merge", () => {
  const directories = getDirectories("src/templates");
  const tmpPathJs = directories.length === 1 ? "tmp" : `tmp/${componentName}`;
  const tasks = directories.map(x => {
    const componentName = getComponentNameFromDirectory(x);
    return gulp
      .src([
        "models/part1.html",
        `${x}/metadata.json`,
        "models/part2.html",
        `tmp/templates/${componentName}/template.css`,
        "models/part3.html",
        `${tmpPathJs}/template.js`,
        "models/part4.html",
        `${x}/template.html`,
        "models/part5.html",
        `tmp/templates/${componentName}/placeholder.css`,
        "models/part6.html",
        `${tmpPathJs}/placeholder.js`,
        "models/part7.html",
        `${x}/placeholder.html`,
        "models/part8.html"
      ])
      .pipe(concat(`${componentName}.html`))
      .pipe(gulp.dest("dist/TemplatesGallery"));
  });
  return merge(tasks);
});
gulp.task("transpile", () => {
  const directories = getDirectories("src/templates");
  return gulp
    .src(
      directories
        .map(x => `${x}/template.ts`)
        .concat(directories.map(x => `${x}/placeholder.ts`))
    )
    .pipe(tsProject())
    .js.pipe(gulp.dest(`tmp`));
});
gulp.task("sass", () => {
  return gulp
    .src("./src/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("tmp"));
});
gulp.task("sync", () => {
  gulp
    .src("dist/**/*")
    .pipe(watch("dist/**/*.*"))
    .pipe(
      spsync({
        username: argv.username,
        password: argv.password,
        site: argv.site,
        verbose: "true",
        watch: true
      })
    );
});
gulp.task("build", gulp.series("transpile", "sass", "merge"));
