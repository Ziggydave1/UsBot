module.exports = {
    name: 'connect4',
    description: 'challenge someone to a game of connect 4',
    args: false,
    guildOnly: true,
    usage: '<person to challenge>',
    permissions: '',
    execute(client, message, args, Discord) {
        const newEmbed = new Discord.MessageEmbed()
        .setColor('f60000')
        .setTitle('Connect 4!')
        .setDescription('@person1 vs @person2')
        .setThumbnail('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nicepng.com%2Fourpic%2Fu2e6q8i1w7r5t4r5_total-downloads-hasbro-grab-and-go-connect-4%2F&psig=AOvVaw2Lh6DYDND7hAmSByJod20G&ust=1618283991023000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIjm7uzf9-8CFQAAAAAdAAAAABAD')
        .addFields(
            { name: 'The board:', value: ':black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:\n:black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:\n:black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:\n:black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:\n:black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:\n:black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:\n:black_circle::black_circle::black_circle::black_circle::black_circle::black_circle::black_circle:' },
        )
        
        message.channel.send(newEmbed);
    }
}