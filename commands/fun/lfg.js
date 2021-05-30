module.exports = {
    name: 'lfg',
    description: 'finds other players for a given game',
    args: true,
    guildOnly: true,
    permissions: false,
    execute(client, message, args, commandName, Discord) {
        const gamePlayers = require('./gamePlayers.json');

        const mentionedGame = args[0];

        let reply = 'Possible players: \n'

        //member is of type [Snowflake, GuildMember]
        for (const member of message.guild.members.cache) {
            if (member[0] !== message.author.id && gamePlayers.players.find(p => p.id === member[0])) {
                if (gamePlayers.find(p => p.id === member[0]).games.indexOf(mentionedGame) !== -1) {
                    reply += `@ ${member[1].user.username}`;
                }
            }
        }

        if (reply === 'Possible players: \n') {
            reply += 'No players found';
        }

        message.channel.send(reply);
    }
}