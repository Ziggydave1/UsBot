const fs = require('fs');
const gameHelper = require('../../helpers/gameHelper');
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
        const targetedMember = message.mentions.members.first() ?? message.member;

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
            case ('viewall'):
                await listAllGamesAsync();
                break;
            case ('view'):
                await viewPlayerGamesAsync();
                break;
            case ('add'):
                addGame();
                break;
            case ('remove'):
                removeGame();
                break;
        }

        async function listAllGamesAsync() {
            let gamesMessage = '';
            for (const game of gameList.games) {
                const emoji = await gameHelper.getEmojiAsync(game, message);
                gamesMessage += `\n${emoji} *\`${game.name}\`*`;
            }
            const gamesEmbed = new Discord.MessageEmbed()
                .setColor('#C792EA')
                .setTitle('Games')
                .setDescription(gamesMessage);
            message.channel.send(gamesEmbed);
        }

        async function viewPlayerGamesAsync() {
            let playerGames = '';

            for (const gameName of player.games)
            {
                game = gameHelper.findGame(gameName);
                let emoji = await gameHelper.getEmojiAsync(game, message);
                playerGames = playerGames + `${emoji} ${game.name} \n`;
            }
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#FFB116')
                .setAuthor(targetedMember.user.username, targetedMember.user.displayAvatarURL())
                .addField('Games', playerGames ? playerGames : 'None')
            message.channel.send(newEmbed);
        }

        function addGame() {
            if (!args[1]) {
                const noGameEmbed = new Discord.MessageEmbed()
                    .setColor('#E01F01')
                    .setTitle('Error: No game mentioned')
                    .setFooter('UsBot', client.user.displayAvatarURL())
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription('Correct usage is \`-mygames add <game>\`');
                message.channel.send(noGameEmbed);
                return;
            }

            game = gameHelper.findGame(args[1]);

            if (player.games.includes(game.id.toLowerCase())) {
                const gameOwnedEmbed = new Discord.MessageEmbed()
                    .setColor('#389D59')
                    .setTitle('Game already owned')
                    .setFooter('UsBot', client.user.displayAvatarURL())
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`${targetedMember.user.username} already has **${game.name}** in their collection!`)
                message.channel.send(gameOwnedEmbed);
                return;
            }
            player.games.push(game.id.toLowerCase());
            if (updateGamePlayersFile()) {
                const gameAddedEmbed = new Discord.MessageEmbed()
                    .setColor('#389D59')
                    .setTitle('Game added')
                    .setFooter('UsBot', client.user.displayAvatarURL())
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`**${game.name}** has been added to ${targetedMember.user.username}'s collection.`)
                message.channel.send(gameAddedEmbed);
            }
        }

        function removeGame() {
            if (!args[1]) {
                const noGameEmbed = new Discord.MessageEmbed()
                    .setColor('#E01F01')
                    .setTitle('Error: No game mentioned')
                    .setFooter('UsBot', client.user.displayAvatarURL())
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription('Correct usage is \`-mygames remove <game>\`');
                message.channel.send(noGameEmbed);
                return;
            }

            game = gameHelper.findGame(args[1]);

            if (!player.games.includes(game.id.toLowerCase())) {
                const gameNotOwnedEmbed = new Discord.MessageEmbed()
                    .setColor('#389D59')
                    .setTitle('Game not owned')
                    .setFooter('UsBot', client.user.displayAvatarURL())
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`${targetedMember.user.username} doesn't have **${game.name}** in their collection!`)
                message.channel.send(gameNotOwnedEmbed);
                return;
            }
            player.games.splice(player.games.indexOf(game.id.toLowerCase()), 1);
            if (updateGamePlayersFile()) {
                const gameRemovedEmbed = new Discord.MessageEmbed()
                    .setColor('#389D59')
                    .setTitle('Game removed')
                    .setFooter('UsBot', client.user.displayAvatarURL())
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`**${game.name}** has been removed from ${targetedMember.user.username}'s collection.`)
                message.channel.send(gameRemovedEmbed);
            }
        }

        function updateGamePlayersFile() {
            jsonString = JSON.stringify(gamePlayers, null, 4);
            fs.writeFile('./commands/fun/gamePlayers.json', jsonString, err => {
                if (err) {
                    console.log('Error adding game', err);
                    return false;
                } else {
                    return true;
                }
            });
            return true;
        }
    }
}