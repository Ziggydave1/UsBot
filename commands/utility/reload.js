const fs = require('fs');
module.exports = {
    name: 'reload',
    description: 'reload a command',
    args: true,
    guildOnly: false,
    usage: '<command to reload>',
    permissions: 'MANAGE_GUILD',
    execute(client, message, args, commandName, Discord) {
        const commandname = args[0].toLowerCase();
        const command = message.client.commands.get(commandname);
        if (!command) return message.channel.send(`There is no command named: ${commandname}`);
        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandname}.js`));
        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];
        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Reloaded \`${commandname}\``);
        } catch (error) {
            console.error(error);
        }
    }
}