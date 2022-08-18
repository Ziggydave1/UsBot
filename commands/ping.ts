import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, CommandInteraction } from 'discord.js';

export default class PingCommand {
	constructor() {}
	data = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings the UsBot')
	async execute(interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder()
            .setTitle(`Pong!`)
		interaction.reply({embeds: [embed]})
	}
}