const gameList = require('../commands/fun/gameList.json');
const stringSimilarity = require('string-similarity');
const allGameNames = gameList.games.map(entry => entry.aliases[0]);

module.exports = {
    //Returns a game object from a name
    findGame(gameName) {
        let game = gameList.games.find(entry => entry.aliases.includes(args[1].toLowerCase()));
        if (!game) {
            gameName = findClosestName(gameName);
            game = gameList.games.find(entry => entry.aliases.includes(args[1].toLowerCase()));
        }
        return game;
    },
    //Returns an emoji from a game object
    getEmoji(game, message) {
        let emoji = message.guild.emojis.cache.find(e => e.name === game.id);
        if (!emoji) {
            await message.guild.emojis.create(`./assets/emoji/${game.id}.png`, game.id);
            emoji = message.guild.emojis.cache.find(e => e.name === game.id);
        }
        return emoji;
    }
}
function findClosestName(gameName) {
    const matches = stringSimilarity.findBestMatch(gameName, allGameNames);
    return matches.bestMatch.target;
}