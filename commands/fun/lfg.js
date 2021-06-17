const gamePlayers = require('./gamePlayers.json');
module.exports = {
    name: 'lfg',
    description: 'finds other players for a given game',
    args: true,
    guildOnly: true,
    permissions: false,
    async execute(client, message, args, commandName, Discord, config) {
        const chosenGame = args[0];
        const gameList = require('./gameList.json');
        const game = gameList.games.find(entry => (entry.id.toLowerCase() === chosenGame.toLowerCase()) || (entry.aliases.includes(chosenGame.toLowerCase())));


        let reply = 'Possible players: \n'
        
        const members = await message.guild.members.fetch();

        //member is of type [Snowflake, GuildMember]
        for (const member of members) {
            if (member[0] !== message.author.id && gamePlayers.players.find(p => p.id === member[0])) {
                if (gamePlayers.players.find(p => p.id === member[0]).games.includes(game.id.toLowerCase()) !== -1) {
                    reply += member[1].user.toString();
                }
            }
        }

        if (reply === 'Possible players: \n') {
            reply += 'No players found';
        }

        message.channel.send(reply);
    }
}