import { existsSync, writeFile } from 'fs';
import promptSync from 'prompt-sync';

existsSync('./config.json') ? (console.log('\n\n*********\nFile already exists\n'), process.exit()) : null;

const prompt = promptSync();

const clientId = prompt('🤖 Enter client ID: ');
const guildId = prompt('🏘️  Enter guild ID: ');
const token = prompt('🔑 Enter token: ');

let config = `{
    "clientId": "${clientId}",
    "guildId": "${guildId}",
    "token": "${token}"
}`

writeFile('./config.json', config, function (err) {
    if (err) throw err;
    console.log('✅ Config file created successfully.');
});