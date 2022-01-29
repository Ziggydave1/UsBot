import { existsSync, writeFile } from 'fs';
import { ExitStatus } from 'typescript';

existsSync('./config.json') ? (console.log('\n\n*********\nFile already exists\n'), process.exit()) : null;

const args = process.argv.slice(2);
let clientID, guildID, token;

if (args.includes('clientId') && args.length >= args.indexOf("clientId") + 2) {
    clientID = args[args.indexOf('clientId') + 1];
}

if (args.includes('guildId') && args.length >= args.indexOf("guildId") + 2) {
    guildID = args[args.indexOf('guildId') + 1];
}

if (args.includes('token') && args.length >= args.indexOf("token") + 2) {
    token = args[args.indexOf('token') + 1];
}

let config = `{
    "clientId": "${clientID}",
    "guildId": "${guildID}",
    "token": "${token}"
}`

writeFile('./config.json', config, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
});