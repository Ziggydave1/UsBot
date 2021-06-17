module.exports = {
    name: 'game',
    description: 'get a list of games suitable for a given group of members',
    args: true,
    guildOnly: true,
    usage: '<@users playing the game>*one or more',
    permissions: '',
    async execute(client, message, args, commandName, Discord, config) {
        const configPath = config.commands.game;
        const gameList = require(`${configPath.gameListJSON}`);

        //mentionedPlayers is of type Collection<Snowflake, GuildMember>
        const mentionedPlayers = message.mentions.members;
        const playerCount = mentionedPlayers.size;
        
        let reply = `${configPath.playableGamesTitle}`;
        let xboxNeeded = false;
        let pcNeeded = false;
        if (playerCount === 1) {
            return message.channel.send(`${configPath.onePlayerMentionedResponse}`);
        }
        //mentionedPlayer is of type GuildMember
        for (const mentionedPlayer of mentionedPlayers.values()) {
            const roles = mentionedPlayer.roles.cache;
            if (roles.find(role => role.name === `${configPath.xboxRoleName}`) && !roles.find(role => role.name === `${configPath.pcRoleName}`)) {
                xboxNeeded = true;
            }
            if (roles.find(role => role.name === `${configPath.pcRoleName}`) && !roles.find(role => role.name === `${configPath.xboxRoleName}`)) {
                pcNeeded = true;
            }
        }

        const gamePlayers = require(`${configPath.playersJSON}`);
        
        for (const game of gameList.games) {
            addToReply = true;
            //mentionedPlayer is of type [Snowflake, GuildMember]
            for (const mentionedPlayer of mentionedPlayers) {
                const gamePlayer = gamePlayers.players.find(p => p.id === mentionedPlayer[0]);
                if (!gamePlayer) {
                    return message.channel.send(eval('`' + configPath.notInPlayerJSONResponse + '`'));
                }
                if (gamePlayer.games.length === 0) {
                    return message.channel.send(eval('`' + configPath.noGamesResponse + '`'));
                }
                if (gamePlayer.games.indexOf(game.id.toLowerCase()) === -1) {
                    addToReply = false;
                }
            }
            if (addToReply) {
                //If crossplay is supported, it's always playable. If crossplay isn't required, every game is playable.
                if (game.crossplay || !(xboxNeeded && pcNeeded)) {
                    if (game.range.min <= playerCount && playerCount <= game.range.max) {
                        let emoji = message.guild.emojis.cache.find(e => e.name === game.id);
                        if (!emoji) {
                            await message.guild.emojis.create(`${configPath.emojiAssets}${game.id}${configPath.emojiAssetType}`, game.id);
                            emoji = message.guild.emojis.cache.find(e => e.name === game.id);
                        }
                        reply += eval('`' + configPath.gameListEntry + '`');
                    }
                }
            }
        }
    
        message.channel.send(reply);
    }
}