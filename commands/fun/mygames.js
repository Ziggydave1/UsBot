const fs = require('fs');
module.exports = {
    name: 'mygames',
    description: 'allows a user to view and manage their owned games',
    args: true,
    guildOnly: true,
    usage: '<@users playing the game>*one or more',
    permissions: '',
    execute(client, message, args, commandName, Discord) {
        fs.readFile('./commands/fun/userGames.json', 'utf8', (err, userData) => {
            if (err) {
                console.log('Error reading profile info', err);
                message.channel.send('Error reading profile info');
                return;
            }
            try {
                const userList = JSON.parse(userData);
                let user = userList.users.find(entry => entry.id === message.author.id);
                let jsonString = '';
                if (!user) {
                    const newUser = { 'id': message.author.id, 'games': []};
                    userList.users.push(newUser);
                    user = newUser;
                    jsonString = JSON.stringify(userList, null, 4);
                    fs.writeFile('./commands/fun/userGames.json', jsonString, err => {
                        if (err) {
                            message.channel.send('Error adding user');
                            console.log('Error adding user', err);
                        } else {
                            message.channel.send('User added');
                        }
                    })
                }
                const gameList = require('./gameConfig.json');
                switch (args[0]) {
                    case ('view'):
                        //This displays user profile info
                        let gamesList = '';
                        user.games.forEach(gameName => {
                            const game = gameList.games.find(entry => entry.emoji.toLowerCase() === gameName);
                            const emoji = message.guild.emojis.cache.find(r => r.name === game.emoji)
                            gamesList = gamesList + `${emoji} ${game.name} \n`;
                        });
                        const newEmbed = new Discord.MessageEmbed()
                            .setColor('#FFFFFF')
                            .setTitle(message.author.username)
                            .setThumbnail(message.author.displayAvatarURL())
                            .addField('Games owned', gamesList ? gamesList : 'None')
                        message.channel.send(newEmbed);
                        break;
                    case ('add'):
                        //This adds a game to a user's collection
                        if (!args[1]) {
                            message.channel.send('Correct usage is \`-mygames add <game name>\`');
                            break;
                        }
                        
                        const game = gameList.games.find(entry => entry.emoji.toLowerCase() === args[1]);
                        if (!game) {
                            message.channel.send('Game not found');
                            break;
                        }

                        if (user.games.includes(args[1])) {
                            message.channel.send('Game already added');
                            break;
                        }
                        user.games.push(args[1]);
                        jsonString = JSON.stringify(userList, null, 4);
                        fs.writeFile('./commands/fun/userGames.json', jsonString, err => {
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
                        
                        if (!user.games.includes(args[1])) {
                            message.channel.send('Game not owned');
                            break;
                        }
                        user.games.splice(user.games.indexOf(args[1]), 1);
                        jsonString = JSON.stringify(userList, null, 4);
                        fs.writeFile('./commands/fun/userGames.json', jsonString, err => {
                            if (err) {
                                message.channel.send('Error removing game');
                                console.log('Error removing game', err);
                            } else {
                                message.channel.send('Game removed');
                            }
                        })
                        break;
                }              
            } catch (err) {
                console.log('Error parsing profile info', err);
                message.channel.send('Error parsing profile info');
            }
        })
    }
}