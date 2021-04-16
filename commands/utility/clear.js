module.exports = {
    name: 'clear',
    description: "clear messages",
    args: true,
    usage: '<# of meassages>',
    guildOnly: false,
    permissions: 'MANAGE_MESSAGES',
    async execute(client, message, args, commandName, Discord) {
        if (isNaN(args[0])) return message.channel.send("Please enter a real number");

        if (args[0] > 100) return message.channel.send("You can't delete more than 100 messages at once");
        if (args[0] < 1) return message.channel.send("You must enter a number greater than 0");

        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
}
//Clear messages from a specific user