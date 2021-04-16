module.exports = {
    name: 'ping',
    description: 'pings the UsBot',
    args: false,
    guildOnly: false,
    permissions: '',
    execute(client, message, args, commandName, Discord) {
        message.channel.send('pong!');
    }
}