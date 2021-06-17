module.exports = {
    name: 'server',
    description: 'server info',
    args: false,
    guildOnly: true,
    permissions: '',
    execute(client, message, args, commandName, Discord, config) {
        message.channel.send(`The server name is: \`${message.guild.name}\`\nTotal members: \`${message.guild.memberCount}\``);
    }
}