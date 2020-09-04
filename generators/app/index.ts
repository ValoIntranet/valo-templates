import Generator from 'yeoman-generator';
import yosay from 'yosay';
import * as path from 'path';

enum option {
  TemplateName = "templatename",
  Placeholder = "placeholder",
  Handlebars = "customhelper"
};

class TemplateGenerator extends Generator {

  constructor(args: any | any[], options: any[]) {
    super(args, options);

    this.option("name", {
      type: String,
      alias: 'n',
      description: "The name of the template to create."
    });
    this.option("placeholder", {
      type: Boolean,
      alias: 'p',
      description: "Specify if you want to create the placeholder files."
    });
    this.option("handlebars", {
      type: Boolean,
      alias: 'c',
      description: "Specify if you want to use a custom helper."
    });
    this.option('skip-install', {
      type: Boolean,
      description: 'Do not automatically install dependencies.',
      default: false
    });
  }

  /**
   * Runs on initializing the generator
   */
  public initializing() {
    this.log(yosay('Welcome to the Valo Template Generator!'));

    this.config.set(option.TemplateName, this.options.name || undefined);

    if (this.options.placeholder !== undefined) {
      this.config.set(option.Placeholder, this.options.placeholder);
    }
    if (this.options.handlebars !== undefined) {
      this.config.set(option.Handlebars, this.options.handlebars);
    }
  }

  /**
   * Asking the questions
   */
  public async prompting(): Promise<void> {
    const questions: Generator.Questions = [{
      type: "input",
      name: option.TemplateName,
      message: "What is the name of your template? ([a-z0-9_-])",
      validate: (input: string) => {
        const re = /^[a-z\d_-]*$/;
        if (re.test(input)) {
          return true;
        } else {
          return "Your template name doesn't match the pattern.";
        }
      },
      when: this.options.name === undefined
    },
    {
      type: "confirm",
      default: false,
      name: option.Placeholder,
      message: "Do you want to include a placeholder template?",
      when: this.options.placeholder === undefined
    },
    {
      type: "confirm",
      default: false,
      name: option.Handlebars,
      message: "Do you want to include a custom helper for the template?",
      when: this.options.handlebars === undefined
    }];

    const answers: Generator.Answers = await this.prompt(questions);
 
    this.config.set(option.TemplateName, this.options.name || answers[option.TemplateName]);
    this.config.set(option.Placeholder, this.options.placeholder === undefined ? answers[option.Placeholder] : this.options.placeholder);
    this.config.set(option.Handlebars, this.options.handlebars === undefined ? answers[option.Handlebars] : this.options.handlebars);

    return;
  }

  /**
   * Configuring the new workspace
   */
  public configuring() {
    const packageJsonTemplate = require('./initial.package.json');
    const pckPath = path.join(this.destinationPath(), 'package.json');

    const templateName = this.config.get(option.TemplateName);
    packageJsonTemplate.name = templateName;

    if (!this.fs.exists(pckPath)) {
      this.log('Creating a new package.json file for the project.');
      this.fs.writeJSON(pckPath, packageJsonTemplate, null, 2);
    } else {
      this.log('The package.json already existed, skipping the new creation.');
    }
  }

  /**
   * Writing the files
   */
  public async writingTemplateFiles() {
    this.log("Creating files for the Valo template.");

    // Retrieve the template name
    const templateName = this.config.get(option.TemplateName);
    const templateDestPath = `src/templates/${templateName}`;

    // Retrieve other settings
    const placeholder = this.config.get(option.Placeholder);
    const customhelper = this.config.get(option.Handlebars);

    this.fs.copyTpl(this.templatePath("template"), this.destinationPath(templateDestPath));

    if (placeholder) {
      this.fs.copyTpl(this.templatePath("placeholder"), this.destinationPath(templateDestPath));
    }

    if (customhelper) {
      this.fs.copyTpl(this.templatePath("helper"), this.destinationPath(templateDestPath));
    }

    this.fs.copyTpl(this.templatePath("root"), this.destinationPath());
  }

  /**
   * Install the required dependencies for the template build engine
   */
  public installCoreDependencies() {
    if (this.options['skip-install']) {
      this.log("Skipping dependency installation");
    } else {
      this.log("Installing core dependencies");
  
      this.npmInstall([ 
        "gulp@4.0.2", 
        "gulp-concat@2.6.1", 
        "gulp-sass@4.1.0", 
        "gulp-spsync-creds@2.3.8", 
        "gulp-typescript@6.0.0-alpha.1", 
        "gulp-watch@5.0.1", 
        "merge-stream@2.0.0",
        "node-sass@4.14.1", 
        "typescript@4.0.2", 
        "yargs@15.4.1"
      ], 
      { 
        "save-dev": true,
        "save-exact": true 
      });
    }
  }

  public end() {
    this.log("All done! You can start building the template!");
  }
}

export = TemplateGenerator;