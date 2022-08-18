import { SlashCommandBuilder } from '@discordjs/builders';
import { GuildMember, Snowflake, Collection, CommandInteraction, ColorResolvable, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { findGame, getEmojiAsync } from './helpers/gameHelper';
import registeredPlayerList from './data/registeredPlayers.json' assert { type: "json" };

export default class LfgCommand {
    constructor() {};
	data = new SlashCommandBuilder()
		.setName('lfg')
		.setDescription('Pings all players of a specified game')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The name of the game to ping')
                .setRequired(true))
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const game = findGame(interaction.options.getString('game'));
        let reply = '';

        const members: Collection<Snowflake, GuildMember> = await interaction.guild.members.fetch();

        for (const member of members) {
            //First we check if the member is in the gamePlayers file
            if (member[0] !== interaction.user.id && registeredPlayerList.players.find(player => player.id === member[0])) {
                //If the member is in the gamePlayers file, we check if they have the game in their list
                if (registeredPlayerList.players.find(player => player.id === member[0]).games.includes(game.aliases[0])) {
                    reply += member[1].user.toString() + '\n';
                }
            }
        }

        if (reply === '') {
            reply += 'No players found';
        }

        const gameEmoji = await getEmojiAsync(game, interaction);

        const playersEmbed = new EmbedBuilder()
            .setColor(game.color as ColorResolvable)
            .setTitle(`${gameEmoji} ${game.name}`)
            .addFields({ name: 'Players', value: reply });
        
        interaction.reply({embeds: [playersEmbed]});
	}
};