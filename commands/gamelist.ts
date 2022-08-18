import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, CommandInteraction, Embed, EmbedBuilder, InteractionResponse } from "discord.js";
import { writeFile } from 'fs';
import { findGame, getEmojiAsync} from './helpers/gameHelper';
import registeredPlayerList from './data/registeredPlayers.json' assert { type: "json" };
import gameList from './data/gameList.json' assert { type: "json" };

export default class GameListCommand {
    constructor() {};
	data = new SlashCommandBuilder()
		.setName('gamelist')
		.setDescription('Manage a player\'s game list')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a game to a player\'s game list')
                .addStringOption(option => option.setName('game').setDescription('The name of the game to add').setRequired(true))
                .addUserOption(option => option.setName('user').setDescription('The user to add the game to')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a game from a player\'s game list')
                .addStringOption(option => option.setName('game').setDescription('The name of the game to remove').setRequired(true))
                .addUserOption(option => option.setName('user').setDescription('The user to remove the game from')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View a user\'s game list')
                .addUserOption(option => option.setName('user').setDescription('The user to view the game list of')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('listall')
                .setDescription('View a list of all games'))
	async execute(interaction: ChatInputCommandInteraction): Promise<InteractionResponse> {

        if (interaction.options.getSubcommand() === 'listall') {
            let reply = '';
            for (const game of gameList.games) {
                const emoji = await getEmojiAsync(game, interaction);
                reply += `${emoji} ${game.name}\n`;
            }
            const gameEmbed = new EmbedBuilder()
                .setColor('#C792EA')
                .setTitle('All Games')
                .setDescription(reply);
            return interaction.reply({embeds: [gameEmbed]});
        }    

        const targetUser = interaction.options.getUser('user') ?? interaction.user;

        let player = registeredPlayerList.players.find(p => p.id === targetUser.id);
        if (!player) {
            player = {
                id: targetUser.id,
                games: []
            };
            registeredPlayerList.players.push(player);
            this.updateRegisteredPlayerList();
        }
        let game;
		switch (interaction.options.getSubcommand()) {
            case 'add':
                game = findGame(interaction.options.getString('game'));
                if (player.games.includes(game.id.toLowerCase())) {
                    const gameOwnedEmbed = new EmbedBuilder()
                        .setColor('#389D59')
                        .setTitle('Game Already Owned')
                        .setDescription(`${targetUser.username} already owns ${game.name}`);
                    return interaction.reply({embeds: [gameOwnedEmbed]});    
                }
                player.games.push(game.id.toLowerCase());
                if (this.updateRegisteredPlayerList()) {
                    const gameAddedEmbed = new EmbedBuilder()
                        .setColor('#389D59')
                        .setTitle('Game Added')
                        .setDescription(`${targetUser.username} now owns ${game.name}`);
                    return interaction.reply({embeds: [gameAddedEmbed]});
                }
            case 'remove':
                game = findGame(interaction.options.getString('game'));
                if (!player.games.includes(game.id.toLowerCase())) {
                    const gameNotOwnedEmbed = new EmbedBuilder()
                        .setColor('#389D59')
                        .setTitle('Game Not Owned')
                        .setDescription(`${targetUser.username} does not own ${game.name}`);
                    return interaction.reply({embeds: [gameNotOwnedEmbed]});
                }
                player.games.splice(player.games.indexOf(game.id.toLowerCase()), 1);
                if (this.updateRegisteredPlayerList()) {
                    const gameRemovedEmbed = new EmbedBuilder()
                        .setColor('#389D59')
                        .setTitle('Game Removed')
                        .setDescription(`${targetUser.username} no longer owns ${game.name}`);
                    return interaction.reply({embeds: [gameRemovedEmbed]});
                }
            case 'view':
                let playerGames = '';

                for (const gameName of player.games) {
                    game = findGame(gameName);
                    const emoji = await getEmojiAsync(game, interaction);
                    playerGames += `${emoji} ${game.name}\n`;
                }
                const gameListEmbed = new EmbedBuilder()
                    .setColor('#FFB116')
                    .setTitle(`${targetUser.username}'s Game List`)
                    .setDescription(playerGames);
                return interaction.reply({embeds: [gameListEmbed]});
        }        
	}
    updateRegisteredPlayerList() {
        const jsonString = JSON.stringify(registeredPlayerList, null, 4);
        writeFile('./commands/data/registeredPlayers.json', jsonString, (err: any) => {
            if (err) {
                console.log('❌ Error updating registered player list:', err);
                return false;
            } else {
                return true;
            }
        });
        return true;
    }
};