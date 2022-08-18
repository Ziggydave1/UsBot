import { AttachmentBuilder, ChatInputCommandInteraction, ColorResolvable, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { findGame } from './helpers/gameHelper';

export default class GameInfoCommand {
    constructor() {};
	data = new SlashCommandBuilder()
		.setName('gameinfo')
		.setDescription('View information for a specified game')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The name of the game to view information for')
                .setRequired(true))
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const game = findGame(interaction.options.getString('game'));
		const thumbnailAttachment = new AttachmentBuilder(`./assets/thumbnail/${game.id}_thumbnail.jpg`);
        const imageAttachment = new AttachmentBuilder(`./assets/image/${game.id}_image.jpg`);
        const gameEmbed = new EmbedBuilder()
            .setColor(game.color as ColorResolvable)
            .setTitle(game.name)
            .setDescription(game.description)
            .setThumbnail(`attachment://${game.id}_thumbnail.jpg`)
            .addFields(
                { name: 'Crossplay', value: game.crossplay ? 'Yes' : 'No', inline: true },
                { name: 'Minimum players', value: game.range.min.toString(), inline: true },
                { name: 'Maximum players', value: game.range.max.toString(), inline: true }
            )
            .setImage(`attachment://${game.id}_image.jpg`);
		await interaction.reply({embeds: [gameEmbed], files: [thumbnailAttachment, imageAttachment]});
	}
};