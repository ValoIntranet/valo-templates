var Generator = require("yeoman-generator");
module.exports = class extends Generator {
  prompting() {
    return this.prompt([
    {
        type: "input",
        name: "componentname",
        message: "Your template name([a-z0-9_-])",
        validate: input => {
        var re = /^[a-z\d_-]*$/;
        if (re.test(input)) {
            return true;
        } else {
            return "Your template name doesnt match the pattern";
        }
        }
    }
    ]).then(answers => {
    this.config.set("componentname", answers.componentname);
    this.config.save();
    });
  }
  writingTemplateFiles() {
    this.log("creating files from template");
    var componentName = this.config.get('componentname');
    var componentDestinationPath = `src/templates/${componentName}`;
    this.fs.copyTpl(
      this.templatePath("template"),
      this.destinationPath(componentDestinationPath)
    );
    this.fs.copyTpl(this.templatePath("root"), this.destinationPath());
  }
  installCoreDependencies() {
    this.log("installing core dependencies");
    this.npmInstall(["typescript", "gulp", "fs", "gulp-util", "merge-stream", "gulp-concat"], { "save-dev": true });
    // this.npmInstall(['jquery', 'lodash', 'loglevel', 'sp-pnp-js', 'whatwg-fetch'], { 'save': true });
  }
  end() {
    this.log("All done! go play now!");
  }
};
