module.exports = {
    name: 'connect4',
    description: 'challenge someone to a game of connect 4',
    args: true,
    guildOnly: true,
    usage: '<person to challenge>',
    permissions: '',
    execute(client, message, args, Discord) {
        let boardWidth = 7;
        let boardHeight = 6;
        let player1 = message.mentions.members.first();
        let player2 = message.author;
        let playerTurn = player1;

        createBoard(boardHeight, boardWidth);
        createTextBoard(gameBoard);

        let newEmbed = new Discord.MessageEmbed()
        .setColor('f60000')
        .setTitle('Connect 4!')
        .setDescription(`${player2} vs ${player1}`)
        .setThumbnail('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.nicepng.com%2Fourpic%2Fu2e6q8i1w7r5t4r5_total-downloads-hasbro-grab-and-go-connect-4%2F&psig=AOvVaw2Lh6DYDND7hAmSByJod20G&ust=1618283991023000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIjm7uzf9-8CFQAAAAAdAAAAABAD')
        .addFields(
            { name: 'The board:', value: textBoard },
        )
        message.channel.send(newEmbed);

        function createBoard(height, width) {
            gameBoard = [];
            for (let i = 0; i < height; i++) {
                let row = [];
                gameBoard.push(row);
                for (let j = 0; j < width; j++) {
                    gameBoard[i].push(0);
                }
            }
        }
        function createTextBoard(array) {
            textBoard = '';
            for (const row of array) {
                for (const spot of row) {
                    switch (spot) {
                        case 0:
                            textBoard += ':black_circle:';
                            break;
                        case 1:
                            textBoard += ':red_circle:';
                            break;
                        case 2:
                            textBoard += ':yellow_circle:';
                            break;
                    }
                }
                textBoard += '\n';
            }
        }
    }
}
/*
-connect4 <user>: sends an invite to play connect 4 to the person mentioned
-drop <#>: plays a piece in the slot specified in the game the sender is in
-board: shows the board of the game you are playing
-accept <user>: accepts an invite sent by the person mentioned to play connect 4
-decline <user>: declines an invite sent by the person mentioned to play connect 4
-stats <user>: shows the stats of the user mentioned
-leaderboard: shows the leaderboard for connect 4
*/