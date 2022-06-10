import gameList from '../data/gameList.json' assert { type: "json" };
import stringSimilarity from 'string-similarity';
const allGameNames = gameList.games.map(game => game.id.toLowerCase());
import { GuildEmoji, Interaction } from 'discord.js';

interface Game {
    name: string
    id: string
    aliases: string[]
    crossplay: boolean
    range: Range
    description: string
    color: string
}
  
interface Range {
    min: number
    max: number
}

//Returns a game object from a name
export function findGame(name: string): Game {
    let game = gameList.games.find(game => game.aliases.includes(name.toLowerCase()));
    if (!game) {
        name = findClosestGameName(name);
        game = gameList.games.find(game => game.aliases.includes(name.toLowerCase()));
    }
    return game;
}

//Returns an emoji from a game object
export async function getEmojiAsync(game: Game, interaction: Interaction): Promise<GuildEmoji> {
    let emoji = interaction.guild.emojis.cache.find(emoji => emoji.name === game.id);
    if (!emoji) {
        await interaction.guild.emojis.create(`./assets/emoji/${game.id}.png`, game.id);
        emoji = interaction.guild.emojis.cache.find(emoji => emoji.name === game.id);
    }
    return emoji;
}
function findClosestGameName(name: string): string {
    let closestName = stringSimilarity.findBestMatch(name, allGameNames).bestMatch.target;
    return closestName;
}