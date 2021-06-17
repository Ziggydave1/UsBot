module.exports = {
    name: 'ping',
    description: 'pings the UsBot',
    args: false,
    guildOnly: false,
    permissions: '',
    execute(client, message, args, commandName, Discord) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#ffffff')
        .setAuthor('pong!')
        message.channel.send(newEmbed);
    }
}