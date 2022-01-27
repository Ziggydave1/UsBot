import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from './config.json' assert { type: "json" };
import { SlashCommandBuilder } from '@discordjs/builders';
import { RESTPostAPIApplicationCommandsJSONBody } from '@discordjs/builders/node_modules/discord-api-types';

interface Command {
    data: SlashCommandBuilder
}

const commands = [] as RESTPostAPIApplicationCommandsJSONBody[];

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.ts'));
for (const file of commandFiles) {
	const loadedCommand = await import(`./commands/${file}`);
	const command: Command = new loadedCommand.default();
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.token);

rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
	.then(() => console.log('✅ Successfully registered application commands.'))
	.catch(console.error);