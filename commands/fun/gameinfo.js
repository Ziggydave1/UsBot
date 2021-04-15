module.exports = {
    name: 'gameinfo',
    description: 'retrieves information about a specified game',
    args: true,
    guildOnly: false,
    permissions: false,
    execute(client, message, args) {
        const config = require('./gameConfig.json');
        const chosenGame = args[0];
        for (const game of config.games) {
            if (game.emoji === chosenGame)
            {
                const newEmbed = new Discord.MessageEmbed()
                .setColor(game.color) //Sets the color of the bar on the side of the embed
                .setTitle(game.name) //Underneath the author
                //.setURL('https://discord.js.org/') //Sets link on the title
                //.setAuthor('Some Name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org') //Sets link on the name and the image to the left, all this is above the title
                .setDescription(game.description) //Right underneath the title
                .setThumbnail(game.logoLink) //In the top right corner of the embed
                .addFields(
                    //{ name: 'Regular field title', value: 'Some value here' }, //Normal field
                    //{ name: '\u200B', value: '\u200B' }, //Adds blank vertical space
                    { name: 'Crossplay supported', value: game.crossplay ? "Yes" : "No", inline: true }, //Consecutive inline field will display side-by-side
                    { name: 'Minimum players', value: game.range.min, inline: true },
                    { name: 'Maximum players', value: game.range.max, inline: true}
                )
                //.addField('Inline field title', 'Some value here', true) //This counts as part of the inline field group from the addFields section
                //.setImage('https://i.imgur.com/wSTFkRM.png') //Adds a large image
                //.setTimestamp() //Turns on the timestamp on the footer
                //.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png'); //Adds the footer text with the image to the left and the timestamp (if added) to the right
        
                 message.channel.send(newEmbed);
            }
        }
    }
}