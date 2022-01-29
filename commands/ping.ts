import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed, CommandInteraction } from 'discord.js';

export default class PingCommand {
	constructor() {}
	data = new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pings the UsBot')
	async execute(interaction: CommandInteraction): Promise<void> {
		const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle(`Pong!`)
		interaction.reply({embeds: [embed]})
	}
}