// Require the necessary discord.js classes
import { readdirSync } from 'node:fs';
import { Client, Collection, CommandInteraction, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import config from './config.json' assert { type: "json" };

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
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.commands = new Collection<string, Command>();

console.log('📂 Reading command folder...');
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.ts'));
console.log('📁 Read command folder with', commandFiles.length, 'commands.');

console.log('🔎 Reading commands...');
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
	if (!interaction.isChatInputCommand()) return;
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