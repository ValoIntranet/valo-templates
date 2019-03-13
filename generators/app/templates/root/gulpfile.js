var gulp = require("gulp"),
  gutil = require("gulp-util"),
  fs = require("fs"),
  concat = require("gulp-concat"),
  path = require("path"),
  merge =  require('merge-stream');

gulp.task("build", () => {
  return gutil.log("Gulp is running!");
});
gulp.task("merge", () => {
  const isDirectory = source => fs.lstatSync(source).isDirectory();
  const getDirectories = source =>
    fs
      .readdirSync(source)
      .map(name => path.join(source, name))
      .filter(isDirectory);
  var directories = getDirectories("src/templates");
var tasks = directories.map(x => {
      return gulp
        .src(["models/part1.html", `${x}/metadata.json`, "models/part2.html", `${x}/template.css`,
        "models/part3.html", `${x}/template.js`, "models/part4.html", `${x}/template.html`,
        "models/part5.html", `${x}/placeholder.css`, "models/part6.html", `${x}/placeholder.js`,
        'models/part7.html', `${x}/placeholder.html`, "models/part8.html"])
        .pipe(concat(`component.html`))
        .pipe(gulp.dest("dist"));
    })
    return merge(tasks);
});
