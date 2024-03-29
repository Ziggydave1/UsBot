import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import config from './config.json' assert { type: "json" };

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
	try {
		console.log('🗑️ Started clearing old commands.');

		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: [] },
		);
		
		await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: [] },
		);

		console.log('🗑️ Successfully cleared old commands.');
	} catch (error) {
		console.error(error);
	}
})();