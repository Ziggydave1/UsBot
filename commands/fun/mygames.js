const fs = require('fs');
module.exports = {
    name: 'mygames',
    description: 'allows a user to view and manage their owned games',
    args: true,
    guildOnly: true,
    usage: '<@users playing the game>*one or more',
    permissions: '',
    async execute(client, message, args, commandName, Discord) {
        const gamePlayers = require('./gamePlayers.json');

        //targetedMember is type GuildMember
        const targetedMember = message.mentions.members.size === 0 ? message.member : message.mentions.members.first();

        let player = gamePlayers.players.find(entry => entry.id === targetedMember.user.id);
        if (!player) {
            const newPlayer = { 'id': targetedMember.user.id, 'games': [] };
            gamePlayers.players.push(newPlayer);
            player = newPlayer;
            const jsonString = JSON.stringify(gamePlayers, null, 4);
            fs.writeFile('./commands/fun/gamePlayers.json', jsonString, err => {
                if (err) {
                    message.channel.send('Error adding player');
                    console.log('Error adding player', err);
                } else {
                    message.channel.send('Player added');
                }
            })
        }
        const gameList = require('./gameList.json');
        //I want to initialize this separately in each case but Node.js doesn't like that
        let game = ""
        
        switch (args[0]) {
            case ('view'):
                //This displays user profile info
                let gamesList = '';
                player.games.forEach(async gameName => {
                    game = gameList.games.find(entry => entry.id.toLowerCase() === gameName.toLowerCase());
                    let emoji = message.guild.emojis.cache.find(e => e.name === game.id);
                    if (!emoji) {
                        await message.guild.emojis.create(`./assets/emoji/${game.id}.png`, game.id);
                        emoji = message.guild.emojis.cache.find(e => e.name === game.id);
                    }
                    gamesList = gamesList + `${emoji} ${game.name} \n`;
                });
                const newEmbed = new Discord.MessageEmbed()
                    .setColor('#FFFFFF')
                    .setTitle(targetedMember.user.username)
                    .setThumbnail(targetedMember.user.displayAvatarURL())
                    .addField('Games owned', gamesList ? gamesList : 'None')
                message.channel.send(newEmbed);
                break;
            case ('add'):
                //This adds a game to a user's collection
                if (!args[1]) {
                    message.channel.send('Correct usage is \`-mygames add <game name>\`');
                    break;
                }

                game = gameList.games.find(entry => (entry.id.toLowerCase() === args[1].toLowerCase()) || (entry.aliases.includes(args[1].toLowerCase())));

                if (!game) {
                    message.channel.send('Game not found');
                    break;
                }

                if (player.games.includes(game.id.toLowerCase())) {
                    message.channel.send('Game already added');
                    break;
                }
                player.games.push(game.id.toLowerCase());
                jsonString = JSON.stringify(gamePlayers, null, 4);
                fs.writeFile('./commands/fun/gamePlayers.json', jsonString, err => {
                    if (err) {
                        message.channel.send('Error adding game');
                        console.log('Error adding game', err);
                    } else {
                        message.channel.send('Game added');
                    }
                })
                break;
            case ('remove'):
                //This removes a game from a user's collection    
                if (!args[1]) {
                    message.channel.send('Correct usage is \`-mygames remove <game name>\`');
                    break;
                }

                game = gameList.games.find(entry => (entry.id.toLowerCase() === args[1].toLowerCase()) || (entry.aliases.includes(args[1].toLowerCase())));

                if (!player.games.includes(game.id.toLowerCase())) {
                    message.channel.send('Game not owned');
                    break;
                }
                player.games.splice(player.games.indexOf(game.id.toLowerCase()), 1);
                jsonString = JSON.stringify(gamePlayers, null, 4);
                fs.writeFile('./commands/fun/gamePlayers.json', jsonString, err => {
                    if (err) {
                        message.channel.send('Error removing game');
                        console.log('Error removing game', err);
                    } else {
                        message.channel.send('Game removed');
                    }
                })
                break;
        }
    }
}