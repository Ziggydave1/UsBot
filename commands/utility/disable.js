const fs = require('fs');
module.exports = {
    name: 'disable',
    description: 'disable a command',
    args: true,
    guildOnly: false,
    usage: '<command to be disabled>',
    permissions: 'MANAGE_GUILD',
    execute(client, message, args) {
        fs.readFile('./config.json', 'utf8', (err, configuration) => {
            if (err) {
                console.log('Error reading from disk', err);
                return
            }
            try {
                const jsonObj = JSON.parse(configuration);
                jsonObj.commands[args[0]].enabled = false;
                const jsonString = JSON.stringify(jsonObj, null, 4);
                fs.writeFile('./config.json', jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err);
                    } else {
                        delete require.cache[require.resolve('../../config.json')];
                        const newConfig = require('../../config.json');
                        message.channel.send(`Turned off \`${args[0]}\``);
                    }
                })
            } catch (err) {
                console.log('Error parsing JSON string')
            }
        })
    }
}