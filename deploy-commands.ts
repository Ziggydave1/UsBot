import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import config from './config.json' assert { type: "json" };
import { RESTPostAPIApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from 'discord.js';

interface Command {
    data: SlashCommandBuilder
}

const commands = [] as RESTPostAPIApplicationCommandsJSONBody[];

console.log('📂 Reading command folder...');
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.ts'));
console.log('📁 Read command folder with', commandFiles.length, 'commands.');

console.log('📖 Reading commands...');
for (const file of commandFiles) {
	const loadedCommand = await import(`./commands/${file}`);
	const command: Command = new loadedCommand.default();
	commands.push(command.data.toJSON());
}
console.log('🧠 Read', commands.length, 'commands.');

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
	try {
		console.log('🔃 Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: commands },
		);
		
		await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commands },
		);

		console.log('✅ Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();