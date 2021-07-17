const gamePlayers = require('./gamePlayers.json');
const gameList = require('./gameList.json');
const gameHelper = require('../../helpers/gameHelper.js')
module.exports = {
    name: 'game',
    description: 'get a list of games suitable for a given group of members',
    args: true,
    guildOnly: true,
    usage: '<@users playing the game>*one or more',
    permissions: '',
    async execute(client, message, args, commandName, Discord) {
        //mentionedPlayers is of type Collection<Snowflake, GuildMember>
        const mentionedPlayers = message.mentions.members;
        const playerCount = mentionedPlayers.size;
        
        let reply = '';
        let xboxNeeded = false;
        let pcNeeded = false;
        if (playerCount === 1) {
            return message.channel.send('You are sad and lonely.');
        }
        //mentionedPlayer is of type GuildMember
        for (const mentionedPlayer of mentionedPlayers.values()) {
            const roles = mentionedPlayer.roles.cache;
            if (roles.find(role => role.name === "Xbox") && !roles.find(role => role.name === "PC")) {
                xboxNeeded = true;
            }
            if (roles.find(role => role.name === "PC") && !roles.find(role => role.name === "Xbox")) {
                pcNeeded = true;
            }
        }

        
        for (const game of gameList.games) {
            addToReply = true;
            //mentionedPlayer is of type [Snowflake, GuildMember]
            for (const mentionedPlayer of mentionedPlayers) {
                const gamePlayer = gamePlayers.players.find(p => p.id === mentionedPlayer[0]);
                if (!gamePlayer) {
                    return message.channel.send(`\`${mentionedPlayer[1].user.username}\` is not a gamer. Use \`-mygames view\` to become a gamer.`);
                }
                if (gamePlayer.games.length === 0) {
                    return message.channel.send(`\`${mentionedPlayer[1].user.username}\` has no games`);
                }
                if (gamePlayer.games.indexOf(game.id.toLowerCase()) === -1) {
                    addToReply = false;
                }
            }
            if (addToReply) {
                //If crossplay is supported, it's always playable. If crossplay isn't required, every game is playable.
                if (game.crossplay || !(xboxNeeded && pcNeeded)) {
                    if (game.range.min <= playerCount && playerCount <= game.range.max) {
                        const emoji = await gameHelper.getEmojiAsync(game, message);
                        reply += `\n${emoji} ${game.name}`;
                    }
                }
            }
        }

        let playerList = '';
        for (const player of mentionedPlayers.values()) {
            playerList += player.user.username + ', ';
        }

        //This is kinda janky but oh well
        playerList = playerList.substring(0, playerList.length - 2)
    
        const gamesEmbed = new Discord.MessageEmbed()
            .setColor('#FFB116')
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Possible games')
            .setDescription(reply)
            .setFooter('UsBot', client.user.displayAvatarURL())
            .addField('Players', playerList)
        message.channel.send(gamesEmbed);
    }
}