const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const message = require('../../events/guild/message');

const queue = new Map();
// queue(message.guild.id, queue_constructor object { voice channel, text channel, connection, song[]});
module.exports = {
    name: 'play',
    aliases: ['skip', 'stop'],
    description: 'music bot',
    args: false,
    guildOnly: true,
    permissions: '',
    async execute(client, message, args, commandName, Discord) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send('You need to be in a channel to execute this command');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You do not have the correct permissions to use this command');
        if (!permissions.has('SPEAK')) return message.channel.send('You do not have the correct permissions to use this command');

        const serverQueue = queue.get(message.guild.id);

        if (commandName === 'play') {
            if (!args.length) return message.channel.send('You need to send the thing you want to play');
            let song = {};

            if (ytdl.validateURL(args[0])) {
                const songInfo = await ytdl.getInfo(args[0]);
                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url }
            } else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url }
                } else {
                    message.channel.send('Error finding the video');
                }
            }
            if (!serverQueue) {
                const queueConstructor = {
                    voiceChannel: voiceChannel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);
    
                try {
                    const connection = await voiceChannel.join();
                    queueConstructor.connection = connection;
                    videoPlayer(message.guild, queueConstructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting');
                }
            } else {
                serverQueue.songs.push(song);
                return message.channel.send(`**${song.title}** was added to the queue`);
            }
        }
        else if (commandName === 'skip') skipSong(message, serverQueue);
        else if (commandName === 'stop') stopSong(message, serverQueue);
    }
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly'});
    songQueue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]);
    });
    await songQueue.textChannel.send(`**${song.title}** is now playing`)
}

const skipSong = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command');
    if (!serverQueue) {
        return message.channel.send('There are no songs in the queue');
    }
    message.channel.send(`**${serverQueue.songs[0].title}** was skipped`)
    serverQueue.connection.dispatcher.end();
}

const stopSong = (message, serverQueue) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}