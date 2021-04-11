module.exports = {
    name: 'ping',
    description: 'pings the UsBot',
    args: false,
    guildOnly: false,
    permissions: '',
    execute(client, message, args) {
        message.channel.send('pong!');
    }
}