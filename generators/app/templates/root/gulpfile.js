const gulp = require("gulp");
const fs = require("fs");
const concat = require("gulp-concat");
const path = require("path");
const merge = require("merge-stream");
const ts = require("gulp-typescript");
const watch = require("gulp-watch");
const sass = require("gulp-sass");
const spsync = require("gulp-spsync-creds").sync;

const tsProject = ts.createProject("tsconfig.json");
sass.compiler = require("node-sass");
const argv = require('yargs').argv;

const isDirectory = source => fs.lstatSync(source).isDirectory();
const getDirectories = source => {
  return fs.readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
}

const getComponentNameFromDirectory = directory => {
  const directoryNameRegex = /[\/\\]+([\w\d_-]+)$/gm;
  const componentName = directoryNameRegex.exec(directory)[1];
  return componentName;
};

gulp.task("merge", () => {
  const directories = getDirectories("src/templates");
  
  const tasks = directories.map(dirPath => {
    const componentName = getComponentNameFromDirectory(dirPath);
    const libPath = dirPath.replace('src', 'lib');

    const files = [];

    // Template metadata
    files.push("models/metadata_start.html");
    files.push(`${dirPath}/metadata.json`);
    files.push("models/metadata_end.html");

    // Styling template
    const tmpPath = path.join(__dirname, libPath, 'template.css');
    if (fs.existsSync(tmpPath)) {
      files.push("models/styling_start.html");
      files.push(tmpPath);
      files.push("models/styling_end.html");
    }

    // Custom helper
    const helperPath = path.join(__dirname, libPath, 'helper.js');
    if (fs.existsSync(helperPath)) {
      files.push("models/handlebars_start.html");
      files.push(helperPath);
      files.push("models/handlebars_end.html");
    }

    // Main content template
    files.push("models/content_start.html");

    // JavaScript template
    const jsPath = path.join(__dirname, libPath, 'template.js');
    if (fs.existsSync(jsPath)) {
      files.push("models/javascript_start.html");
      files.push(jsPath);
      files.push("models/javascript_end.html");
    }

    files.push(`${dirPath}/template.html`);
    files.push("models/content_end.html");

    // Placeholder template
    const placeholderPath = path.join(__dirname, dirPath, 'placeholder.html');
    if (fs.existsSync(placeholderPath)) {
      files.push("models/placeholder_start.html");
      files.push(placeholderPath);
      files.push("models/placeholder_end.html");
    }

    return gulp.src([...files])
    .pipe(concat(`${componentName}.html`))
    .pipe(gulp.dest("dist/TemplatesGallery"));
  });

  return merge(tasks);
});

gulp.task("transpile", () => {
  return gulp.src("src/**/*.ts").pipe(tsProject()).js.pipe(gulp.dest(`./lib`));
});

gulp.task("sass", () => {
  return gulp.src("src/**/*.scss").pipe(sass().on("error", sass.logError)).pipe(gulp.dest(`./lib`));
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
