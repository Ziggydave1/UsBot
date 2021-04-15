module.exports = (Discord, client, message) => {
    const config = require('../../config');
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return message.channel.send('This command does not exist')
    if (!config.commands[command.name].enabled) {
        return message.channel.send('That command is not enabled')
    }
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.channel.send('I can\'t execute that command inside a DM');
    }
    if (command.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(command.permissions)) {
            return message.channel.send('You do not have the correct permissions to use this command');
        }
    }
    if (command.args && !args.length) {
        let reply = 'You must provide arguments for this command';
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }
    try {
        command.execute(client, message, args, commandName, Discord);
    } catch (error) {
        console.error(error);
        message.channel.send('There was an error with executing the command');
    }
}