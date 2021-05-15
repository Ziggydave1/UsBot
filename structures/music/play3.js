const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const message = require('../../events/guild/message');

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
                const connection = await voiceChannel.join();
                queueConstructor.connection = connection;
                videoPlayer(message.guild, queueConstructor.songs[0], queue);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting');
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`**${song.title}** was added to the queue`);
        }
    }
}

const videoPlayer = async (guild, song, queue) => {
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
        videoPlayer(guild, songQueue.songs[0], queue);
    });
    await songQueue.textChannel.send(`**${song.title}** is now playing`)
}

/*
This is the original music bot
It is now for reference only
*/