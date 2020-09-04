"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const yosay_1 = __importDefault(require("yosay"));
const path = __importStar(require("path"));
var option;
(function (option) {
    option["TemplateName"] = "templatename";
    option["Placeholder"] = "placeholder";
    option["Handlebars"] = "customhelper";
})(option || (option = {}));
;
class TemplateGenerator extends yeoman_generator_1.default {
    constructor(args, options) {
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
    initializing() {
        this.log(yosay_1.default('Welcome to the Valo Template Generator!'));
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
    async prompting() {
        const questions = [{
                type: "input",
                name: option.TemplateName,
                message: "What is the name of your template? ([a-z0-9_-])",
                validate: (input) => {
                    const re = /^[a-z\d_-]*$/;
                    if (re.test(input)) {
                        return true;
                    }
                    else {
                        return "Your template name doesn't match the pattern.";
                    }
                },
                when: this.options.name === undefined
            }, {
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
        const answers = await this.prompt(questions);
        this.config.set(option.TemplateName, this.options.name || answers[option.TemplateName]);
        this.config.set(option.Placeholder, this.options.placeholder === undefined ? answers[option.Placeholder] : this.options.placeholder);
        this.config.set(option.Handlebars, this.options.handlebars === undefined ? answers[option.Handlebars] : this.options.handlebars);
        return;
    }
    /**
     * Configuring the new workspace
     */
    configuring() {
        const packageJsonTemplate = require('./initial.package.json');
        const pckPath = path.join(this.destinationPath(), 'package.json');
        const templateName = this.config.get(option.TemplateName);
        packageJsonTemplate.name = templateName;
        if (!this.fs.exists(pckPath)) {
            this.log('Creating a new package.json file for the project.');
            this.fs.writeJSON(pckPath, packageJsonTemplate, null, 2);
        }
        else {
            this.log('The package.json already existed, skipping the new creation.');
        }
    }
    /**
     * Writing the files
     */
    async writingTemplateFiles() {
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
    installCoreDependencies() {
        if (this.options['skip-install']) {
            this.log("Skipping dependency installation");
        }
        else {
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
            ], {
                "save-dev": true,
                "save-exact": true
            });
        }
    }
    end() {
        this.log("All done! You can start building the template!");
    }
}
module.exports = TemplateGenerator;
//# sourceMappingURL=index.js.map