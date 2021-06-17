const fs = require('fs');
module.exports = {
    name: 'toggle',
    description: 'toggle a command',
    args: true,
    guildOnly: false,
    usage: '<command to be toggled>',
    permissions: 'MANAGE_GUILD',
    execute(client, message, args, commandName, Discord, config) {
        let state = 'on';
        fs.readFile('./config.json', 'utf8', (err, configuration) => {
            if (err) {
                console.log('Error reading from disk', err);
                return
            }
            try {
                const jsonObj = JSON.parse(configuration);
                if (jsonObj.commands[args[0]].enabled) {
                    jsonObj.commands[args[0]].enabled = false;
                    state = 'off';
                } else {
                    jsonObj.commands[args[0]].enabled = true;
                }
                const jsonString = JSON.stringify(jsonObj, null, 4);
                fs.writeFile('./config.json', jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err);
                    } else {
                        delete require.cache[require.resolve('../../config.json')];
                        const newConfig = require('../../config.json');
                        message.channel.send(`Turn ${state} \`${args[0]}\``);
                    }
                })
            } catch (err) {
                console.log('Error parsing JSON string')
            }
        })
    }
}