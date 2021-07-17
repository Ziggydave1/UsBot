const gamePlayers = require('./gamePlayers.json');
const gameHelper = require('../../helpers/gameHelper');
module.exports = {
    name: 'lfg',
    description: 'finds other players for a given game',
    args: true,
    guildOnly: true,
    permissions: false,
    async execute(client, message, args, commandName, Discord) {
        if (!args[0]) {
            return;
        }

        const gameList = require('./gameList.json');
        const game = gameHelper.findGame(args[0]);

        let reply = '';
        
        const members = await message.guild.members.fetch();

        //member is of type [Snowflake, GuildMember]
        for (const member of members) {
            if (member[0] !== message.author.id && gamePlayers.players.find(p => p.id === member[0])) {
                if (gamePlayers.players.find(p => p.id === member[0]).games.includes(game.id.toLowerCase())) {
                    reply += member[1].user.toString();
                }
            }
        }

        if (reply === '') {
            reply += 'No players found';
        }

        const gameEmoji = await gameHelper.getEmojiAsync(game, message);

        const playersEmbed = new Discord.MessageEmbed()
            .setColor(game.color)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(`${gameEmoji} ${game.name}`)
            .addField('Possible players:', reply)
            .setFooter('UsBot', client.user.displayAvatarURL())
        message.channel.send(playersEmbed);
    }
}