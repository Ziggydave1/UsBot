const play = require('../../structures/music/play');
const skip = require('../../structures/music/skip');
const stop = require('../../structures/music/stop');

const queue = new Map();

module.exports = {
    name: 'music',
    aliases: ['play', 'skip', 'stop'],
    description: 'music bot',
    args: false,
    guildOnly: true,
    permissions: '',
    async execute(client, message, args, commandName, Discord) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You must be in a channel to execute this command');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the permissions to execute this command');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the permissions to execute this command');
        if (message.member.roles.cache.some(role => role.name === 'No Music')) return message.channel.send(`${message.author.username}, You arent allowed to play music right now`);

        const serverQueue = queue.get(message.guild.id);

        if (commandName === 'play') {
            play.execute(client, message, args, commandName, Discord/*, queue, serverQueue, voiceChannel  for play2.js*/);
        }
    }
}

/*
This handles when the music bot is used
This handles which command to use
Remove the comments from line 25 to use the music player enabled version
*/