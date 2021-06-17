const config = require('../../config.json')
module.exports = {
    name: 'mcserver',
    description: 'mc server maintenance',
    args: true,
    guildOnly: false,
    usage: '<|start <server> |stop <server> |restart <server>|info ?<server>|>',
    permissions: '',
    execute(client, message, args, commandName, Discord, config) {
        switch (args[0]) {
            case ('start'):
                if (!args[1]) {
                    message.channel.send(`You have not provided all the needed arguments\nThe proper usage would be: \`${config.prefix}mcserver start <server>\``)
                    break;
                }
                message.channel.send(`You want to start ${args[1]}`)
                break;
            case ('stop'):
                if (!args[1]) {
                    message.channel.send(`You have not provided all the needed arguments\nThe proper usage would be: \`${config.prefix}mcserver stop <server>\``)
                    break;
                }
                message.channel.send(`You want to stop ${args[1]}`)
                break;
            case ('restart'):
                if (!args[1]) {
                    message.channel.send(`You have not provided all the needed arguments\nThe proper usage would be: \`${config.prefix}mcserver restart <server>\``)
                    break;
                }
                message.channel.send(`You want to restart ${args[1]}`)
                break;
            case ('info'):
                if (!args[1]) {
                    message.channel.send(`You want to see the info of all servers`)
                    break;
                }
                message.channel.send(`You want to see the info of ${args[1]}`)
                break;
        }
    }
}
/*
1. Get base info
    a. bot config
    b. mc server config
    c. the command they are trying to do
2. Start
    a. check if server name is valid
    b. check if the server is already running
    c. get the computer the bot is running on
    d. get the computer the server is on
    3. use the correct method to start the server
        i. run shell script if bot and server is on the same computer
        ii. ssh and then run if bot and server are on different computers
3. Stop
    a. check if server name is valid
    b. check if the server is already off
    c. get the computer the bot is running on
    d. get the computer the server is running on
    3. use the correct method to stop the server
        i. run shell script if bot and server is on the same computer
        ii. ssh and then run if bot and server are on different computers
4. Restart
    a. check if server name is valid
    b. check if the server is already off
    c. get the computer the bot is running on
    d. get the computer the server is running on
    3. use the correct method to restart the server
        i. run shell script if bot and server is on the same computer
        ii. ssh and then run if bot and server are on different computers
5. Info
    a. all servers
        i. send out the server info for all servers
    b. specific server
        i. see if the server name is valid
        ii. send out the server info for named server
*/