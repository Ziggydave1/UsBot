import { GuildMember, Snowflake, Collection, MessageEmbed, CommandInteraction } from "discord.js";
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from '@discordjs/builders';
import Error from "../structures/errorEmbed";
import Success from "../structures/successEmbed";
import config from '../config.json';
import * as process from 'child_process';

//TODO: use regex to detect stdout data more accurately

export default class MinecraftServer {
    mcInstance: process.ChildProcessWithoutNullStreams;
    data: SlashCommandSubcommandsOnlyBuilder;
    constructor() {
        this.mcInstance = null;
        this.data = new SlashCommandBuilder()
        .setName('mcserver')
		.setDescription('Do things with the Minecraft Server')
        .addSubcommand(subcommand => subcommand
            .setName('start')
            .setDescription('Start the server'))
        .addSubcommand(subcommand => subcommand
            .setName('stop')
            .setDescription('Stop the server'))
        .addSubcommand(subcommand => subcommand
            .setName('info')
            .setDescription('Get the server info'))
        .addSubcommand(subcommand => subcommand
            .setName('execute')
            .setDescription('Execute a command on the server')
            .addStringOption(option => option.setName('command').setDescription('Minecraft command').setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('restart')
            .setDescription('Restart the server'))
    };
    async execute(interaction: CommandInteraction): Promise<void> {
        switch (interaction.options.getSubcommand()) {
            case 'start':
                if (this.mcInstance) {
                    const embed = new Error('Server is already running');
                    return interaction.reply({embeds: [embed]});
                } else {
                    this.mcInstance = process.spawn('cmd.exe', ['/c', config.mcServer.path + '\\start.bat']);
                    const embed = new Success('Server starting');
                    await interaction.reply({embeds: [embed]});
                    this.mcInstance.stdout.on('data', async (data) => {
                        if (data.includes(' Done ')) {
                            const embed = new Success('Server started');
                            return await interaction.editReply({embeds: [embed]});
                        }
                    })
                }
            case 'stop':
                if (this.mcInstance) {
                    this.mcInstance.stdin.write('stop\n');
                    const embed = new Success('Server stopping');
                    await interaction.reply({embeds: [embed]});
                    //TODO: check to see if there are players online before stopping
                    this.mcInstance.stdout.on('data', async (data) => {
                        if (data.includes('Press any key to continue')) {
                            this.mcInstance.kill();
                            this.mcInstance = null;
                            const embed = new Success('Server stopped');
                            return await interaction.editReply({embeds: [embed]});
                        }
                    })
                } else {
                    const embed = new Error('Server is already stopped');
                    return interaction.reply({embeds: [embed]});
                }
            /*
            case 'info':
                return interaction.reply({embeds: [new Error('Not implemented yet')]});
            case 'execute':
                return interaction.reply({embeds: [new Error('Not implemented yet')]});
            case 'restart':
                return interaction.reply({embeds: [new Error('Not implemented yet')]});
                */
        }
    }
}
/*
mcInstance.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    if (data.includes(' Done ')) {
        mcInstance.stdin.write('stop\n');
    }
});

mcInstance.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

mcInstance.on('exit', function (code) {
    console.log('child process exited with code ' + code);
});
*/