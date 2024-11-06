
const { program } = require('commander');

program
    .option('-npk --noun_project_key <noun_project_key>', 'Key for Noun Project API')
    .option('-nps --noun_project_secret <noun_project_secret>', 'Secret for Noun Project API')
    .option('-p, --port <port>', 'Port to listen on');
    
program.parse(process.argv);
const options = program.opts();

console.log(JSON.stringify(process.env, null, 2));

const port = options.port ?? 3000;
const noun_project_key = options.noun_project_key ?? process.env.NOUN_PROJECT_KEY;
const noun_project_secret = options.noun_project_secret ?? process.env.NOUN_PROJECT_SECRET;

module.exports = {port, noun_project_key, noun_project_secret};