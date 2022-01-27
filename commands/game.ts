import { GuildMember, Snowflake, Collection, MessageEmbed, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { getEmojiAsync} from './helpers/gameHelper';
import gameList from './data/gameList.json' assert { type: "json" };
import registeredPlayerList from './data/registeredPlayers.json' assert { type: "json" };

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
 
export default class GameCommand { 
    constructor() {};                                       
	data = new SlashCommandBuilder()
		.setName('game')
		.setDescription('Finds suitable games for a group of players')
        .addUserOption(option =>
            option.setName('player1')
            .setDescription('The first player in the group')
            .setRequired(true))
        .addUserOption(option =>
            option.setName('player2')
            .setDescription('The second player in the group')
            .setRequired(true))
        .addUserOption(option =>
            option.setName('player3')
            .setDescription('The third player in the group')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('player4')
            .setDescription('The fourth player in the group')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('player5')
            .setDescription('The fifth player in the group')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('player6')
            .setDescription('The sixth player in the group')
            .setRequired(false))
	async execute(interaction: CommandInteraction): Promise<void> {
        const allMembers: Collection<Snowflake, GuildMember> = await interaction.guild.members.fetch();
        const mentionedMembers = new Collection<Snowflake, GuildMember>();
        // The exclamation points tell TypeScript that the value will never be null, which I think is a safe assumption to make.
        mentionedMembers.set(interaction.options.getUser('player1')!.id, allMembers.find(member => member.id === interaction.options.getUser('player1').id)!);
        mentionedMembers.set(interaction.options.getUser('player2')!.id, allMembers.find(member => member.id === interaction.options.getUser('player2').id)!);
        if (interaction.options.getUser('player3')) {
            mentionedMembers.set(interaction.options.getUser('player3')!.id, allMembers.find(member => member.id === interaction.options.getUser('player3').id)!);
        }
        if (interaction.options.getUser('player4')) {
            mentionedMembers.set(interaction.options.getUser('player4')!.id, allMembers.find(member => member.id === interaction.options.getUser('player4').id)!);
        }
        if (interaction.options.getUser('player5')) {
            mentionedMembers.set(interaction.options.getUser('player5')!.id, allMembers.find(member => member.id === interaction.options.getUser('player5').id)!);
        }
        if (interaction.options.getUser('player6')) {
            mentionedMembers.set(interaction.options.getUser('player6')!.id, allMembers.find(member => member.id === interaction.options.getUser('player6').id)!);
        }   

        let xboxNeeded = false;
        let pcNeeded = false;

        for (const member of mentionedMembers.values()) {
            if (!registeredPlayerList.players.find(player => player.id === member.id)) {
                return interaction.reply(`${member} is not a registered gamer. Use \`/mygames view\` to register yourself.`);
            }
            const roles = member.roles.cache;
            if (roles.find(role => role.name === 'Xbox') && !roles.find(role => role.name === 'PC')) {
                xboxNeeded = true;
            }
            if (roles.find(role => role.name === 'PC') && !roles.find(role => role.name === 'Xbox')) {
                pcNeeded = true;
            }
        }

        let reply = '';

        for (const game of gameList.games) {
            let addToReply = true;
            for (const memberId of mentionedMembers.keys()) {
                const player = registeredPlayerList.players.find(p => p.id === memberId);
                if (player.games.length === 0) {
                    return interaction.reply(`@<${memberId}> is not registered for any games. Use \`/mygames add\` to add games.`);
                }
                if (!player.games.find(g => g === game.aliases[0])) {
                    addToReply = false;
                }
            }
            if (addToReply) {
                //If crossplay is supported, it's always playable. If crossplay isn't required, every game is playable.
                if (game.crossplay || !(xboxNeeded && pcNeeded)) {
                    if (game.range.min <= mentionedMembers.size && game.range.max >= mentionedMembers.size) {
                        const emoji = await getEmojiAsync(game, interaction);
                        reply += `${emoji} ${game.name}\n`;
                    }
                }
            }
        }

        if (reply === '') {
            reply = 'No suitable games found.';
        }

        if (mentionedMembers.size < 2) {
            reply = 'You need at least 2 players to play a game.';
        }
        
        let playerList = '';
        for (const member of mentionedMembers.values()) {
            playerList += member.toString() + ', ';
        }
        //Remove the last comma and space
        playerList = playerList.slice(0, -2);

        const gameEmbed = new MessageEmbed()
            .setColor('#FFB116')
            .setTitle('Possible Games')
            .setDescription(reply)
            .addField('Players', playerList)
        interaction.reply({embeds: [gameEmbed]});
	}
};