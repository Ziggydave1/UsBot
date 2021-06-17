module.exports = {
    name: 'configload',
    description: 'reload config file',
    args: false,
    guildOnly: false,
    permissions: 'MANAGE_GUILD',
    execute(client, message, args, commandName, Discord, config) {
        try {
            delete require.cache[require.resolve('../../config.json')];
            const newConfig = require('../../config.json');
            message.channel.send('Reloaded \`config\`');
        } catch (error) {
            console.error(error);
        }
    }
}