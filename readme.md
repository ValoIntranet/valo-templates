# Welcome to the Valo template project generator
This generator helps you get started quickly for valo templates projects with proper tooling (sass, typescript, json validation, html validation...)
## Usage
```Shell
git clone https://github.com/baywet/valo-templates.git
npm install
npm link
```
Then on a new folder/project
```Shell
yo valo
```
Give a name to your new template.  
In your new project you'll find
- `src/template/templatename/metadata.json` : the metadata you find at the beginning of your template, with JSON validation
- `src/template/templatename/placeholder.html` : the html of the placeholder
- `src/template/templatename/placeholder.scss` : the sass of the placeholder
- `src/template/templatename/placeholder.ts` : the TypeScript of the placerholder
- `src/template/templatename/template.html` : the html of the template 
- `src/template/templatename/template.scss` : the sass of the template
- `src/template/templatename/template.ts` : the typescript of the template

Lastly run the following command to watch and upload your files automatically into sharepoint:
```Shell
gulp sync --username john.doe@aperure.onmicrosoft.com --password YourPassword --site https://aperture.sharepoint.com/sites/valotemplates
```
And in another window run this command whenever you want to build your templates
```Shell
gulp build
```

## TODO List
- minifying json, html, javascript, css