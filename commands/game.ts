import { GuildMember, Snowflake, Collection, EmbedBuilder, CommandInteraction, InteractionResponse } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import { getEmojiAsync} from './helpers/gameHelper';
import gameList from './data/gameList.json' assert { type: "json" };
import registeredPlayerList from './data/registeredPlayers.json' assert { type: "json" };
  
interface Range {
    min: number
    max: number
}
 
export default class GameCommand { 
    data: SlashCommandBuilder;
    constructor() {
        this.data = new SlashCommandBuilder()
            .setName('game')
            .setDescription('Finds suitable games for a group of players');
        const numbers = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
        for (let number = 1; number < 7; number++) {
            this.data.addUserOption(option =>
                option.setName(`player${number}`)
                .setDescription(`The ${numbers[number - 1]} player in the group`)
                .setRequired(number < 3));
        }
    };
	async execute(interaction: CommandInteraction): Promise<InteractionResponse> {
        const allMembers: Collection<Snowflake, GuildMember> = await interaction.guild.members.fetch();
        const mentionedMembers = new Collection<Snowflake, GuildMember>();
        for (let number = 1; number < 7; number++) {
            const user = interaction.options.getUser(`player${number}`);
            if (user) {
                mentionedMembers.set(user.id, allMembers.find(member => member.id === user.id)!);
            }
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

        const gameEmbed = new EmbedBuilder()
            .setColor('#FFB116')
            .setTitle('Possible Games')
            .setDescription(reply)
            .addFields({ name: 'Players', value: playerList })
        interaction.reply({embeds: [gameEmbed]});
	}
};