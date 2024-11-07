require('dotenv').config();
const { program } = require('commander');

const DEFAULT_PORT = 3000;

program
    .option('-npk --noun_project_key <noun_project_key>', 'Key for Noun Project API')
    .option('-nps --noun_project_secret <noun_project_secret>', 'Secret for Noun Project API')
    .option('-gk --gemini_key', "Key for Google's Gemini API")
    .option(`-p, --port <port>', 'Port to listen on (Defaults to ${DEFAULT_PORT})`);
    
program.parse(process.argv);
const options = program.opts();

const noun_project_key = options.noun_project_key ?? process.env.NOUN_PROJECT_KEY;
const noun_project_secret = options.noun_project_secret ?? process.env.NOUN_PROJECT_SECRET;
const gemini_key = options.gemini_key ?? process.env.GEMINI_KEY;
const port = options.port ?? DEFAULT_PORT;

module.exports = {port, noun_project_key, noun_project_secret, gemini_key};