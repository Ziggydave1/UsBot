const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const message = require('../../events/guild/message');

module.exports = {
    async execute(client, message, args, commandName, Discord, queue, queueConstructor, voiceChannel) {
        const connection = await voiceChannel.join();
        queueConstructor.connection = connection;
        videoPlayer(message.guild, queueConstructor.songs[0], queue);
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