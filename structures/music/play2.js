const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const message = require('../../events/guild/message');
const music_player = require('./music_player')

module.exports = {
    async execute(client, message, args, commandName, Discord, queue, serverQueue, voiceChannel) {
        if (!args.length) return message.channel.send('You need to provide a song to play');
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
                music_player.execute(client, message, args, commandName, Discord, queue, queueConstructor, voiceChannel);
            } catch {
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting');
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** was added to the queue`);
        }
    }
}

/*
This is a version of the updated music bot that uses the music player
It seems like this version has trouble with the music stopping randomly
*/