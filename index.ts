// Require the necessary discord.js classes
import { readdirSync } from 'fs';
import { Client, Collection, CommandInteraction, Intents } from 'discord.js';
import config from './config.json' assert { type: "json" };
import { SlashCommandBuilder } from '@discordjs/builders';

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>
    }
}
interface Command {
    data: SlashCommandBuilder
	execute(interaction: CommandInteraction): Promise<void>
}

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection<string, Command>();

console.log('📂 Reading commands...');
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.ts'));
console.log('📁 Read', commandFiles.length, 'commands.');

console.log('🔎 Registering commands...');
for (const file of commandFiles) {
	const loadedCommand = await import(`./commands/${file}`);
	const command: Command = new loadedCommand.default();

	client.commands.set(command.data.name, command);
}
console.log('✅ Registered', client.commands.size, 'commands.');

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('✅ Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	console.log('💬 Interaction created');
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		console.log('🔨 Running command', interaction.commandName);
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(config.token);