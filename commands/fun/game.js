module.exports = {
    name: 'game',
    description: 'get a game suitable for a given group of members',
    args: true,
    guildOnly: true,
    usage: '<@users playing the game>*one or more',
    permissions: '',
    execute(client, message, args) {
        const config = require('./gameConfig.json');
        const targets = message.mentions.members;
        const peopleNum = targets.size;

        let reply = '**The games you can play are:**\n-------------------------------------------';
        let xboxNeeded = false;
        let pcNeeded = false;
        if (peopleNum == 1) {
            return message.channel.send('You are sad and lonely.');
        }
        for (const target of targets) {
            const guildMember = target[1];
            const roles = guildMember._roles;
            if (roles.includes('829524476998713376') && !roles.includes('829524517016567858')) {
                xboxNeeded = true;
            }
            if (roles.includes('829524517016567858') && !roles.includes('829524476998713376')) {
                pcNeeded = true;
            }
        }
        switch (true) {
            case (xboxNeeded && pcNeeded):
                for (const game of config.games) {
                    if (game.crossplay) {
                        if (game.range.min <= peopleNum && peopleNum <= game.range.max) {
                            if (game.emoji) {
                                const emoji = message.guild.emojis.cache.find(r => r.name == game.emoji);
                                reply += `\n${emoji} *\`${game.name}\`*`;
                            } else {
                                reply += `\n:question: *\`${game.name}\`*`;
                            }
                        }
                    }
                }
                break;
            case (!xboxNeeded || !pcNeeded):
                for (const game of config.games) {
                    if (game.range.min <= peopleNum && peopleNum <= game.range.max) {
                        if (game.emoji) {
                            const emoji = message.guild.emojis.cache.find(r => r.name == game.emoji);
                            reply += `\n${emoji} *\`${game.name}\`*`;
                        } else {
                            reply += `\n:question: *\`${game.name}\`*`;
                        }
                    }
                }
                break;
        }
        message.channel.send(reply);
    }
}