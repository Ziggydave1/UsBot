module.exports = {
    name: 'gameinfo',
    description: 'retrieves information about a specified game',
    args: true,
    guildOnly: false,
    permissions: false,
    execute(client, message, args, commandName, Discord) {
        const gameList = require('./gameList.json');
        const chosenGame = args[0];

        const game = gameList.games.find(entry => entry.id.toLowerCase() === chosenGame.toLowerCase());
        if (game) {
            const newEmbed = new Discord.MessageEmbed()
                .setColor(game.color)
                .setTitle(game.name)
                .setDescription(game.description)
                .setThumbnail(game.logoLink)
                .addFields(
                    { name: 'Crossplay', value: game.crossplay ? "Yes" : "No", inline: true },
                    { name: 'Minimum players', value: game.range.min, inline: true },
                    { name: 'Maximum players', value: game.range.max, inline: true }
                )
                .setImage(game.imageLink);
            message.channel.send(newEmbed);
        } else {
            message.channel.send('Game not found.');
        }
    }
}