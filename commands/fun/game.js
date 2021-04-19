module.exports = {
    name: 'game',
    description: 'get a game suitable for a given group of members',
    args: true,
    guildOnly: true,
    usage: '<@users playing the game>*one or more',
    permissions: '',
    execute(client, message, args, commandName, Discord) {
        const config = require('./gameConfig.json');
        const players = message.mentions.members;
        const playerCount = players.size;
        const xboxId = '829524476998713376';
        const pcId = '829524517016567858';

        let reply = '**The games you can play are:**\n-------------------------------------------';
        let xboxNeeded = false;
        let pcNeeded = false;
        if (playerCount === 1) {
            return message.channel.send('You are sad and lonely.');
        }
        for (const player of players.values()) {
            const roles = player.roles.cache;
            if (roles.has(xboxId) && !roles.has(pcId)) {
                xboxNeeded = true;
            }
            if (roles.has(pcId) && !roles.has(xboxId)) {
                pcNeeded = true;
            }
        }

        for (const game of config.games) {
            //If crossplay is supported, it's always playable. If crossplay isn't required, every game is playable.
            if (game.crossplay || !(xboxNeeded && pcNeeded)) {
                if (game.range.min <= playerCount && playerCount <= game.range.max) {
                    if (game.emoji) {
                        const emoji = message.guild.emojis.cache.find(r => r.name === game.emoji);
                        reply += `\n${emoji} *\`${game.name}\`*`;
                    } else {
                        reply += `\n:question: *\`${game.name}\`*`;
                    }
                }
            }
        }    
        message.channel.send(reply);
    }
}