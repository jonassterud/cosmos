module.exports = {
    name: '4row',
    description: '\:red_circle: Play 4 in a row with another user',
    args: true,
    usage: '<opponent> <credit amount>',
    async execute(message, args) {
        // Variable(s):
        const member = message.mentions.members.first();
        const creditAmount = parseInt(args[1]) || 0;
        let opponentTurn = false;

        // Guard(s):
        if(member.id === message.author.id) return message.channel.send(`\:no_entry: You can't challenge yourself, <@${message.author.id}>!`);
        if(!Object.prototype.hasOwnProperty.call(accounts, message.author.id)) return message.channel.send(`\:no_entry: Create an account first with \`${config.prefix}account\`, <@${message.author.id}>!`);
        if(creditAmount > accounts[message.author.id].balance) return message.channel.send(`\:moneybag: Insufficient funds, <@${message.author.id}>!`);

        // Define table:
        const emotes = {blank: '⚪', player1: '🔴', player2: '🟢', numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣']};
        let table = [...Array(7)].map(() => [...Array(7)].fill(emotes.blank));

        // Create embed:
        const embed = new Discord.MessageEmbed()
            .setDescription(`${table.join('\n').replace(/,/g, '')}\n\n${emotes.numbers.join('')}`)
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Send embed and react with emotes:
        const sentMessage = await message.channel.send(embed);
        for(const emote of emotes.numbers) await sentMessage.react(emote);

        // Create collector:
        const filter = (reaction, user) => (user.id == message.author.id || user.id == member.id) && emotes.numbers.includes(reaction.emoji.name);
        const collector = sentMessage.createReactionCollector(filter, {time: 1000 * 60 * 5});

        // On reaction:
        collector.on('collect', (reaction, user) => {
            // Remove reaction from embed:
            reaction.users.remove(user.id);

            // Guard(s):
            if(!Object.prototype.hasOwnProperty.call(accounts, user.id)) return message.channel.send(`\:no_entry: Create an account first with \`${config.prefix}account\`, <@${user.id}>!`);
            if(creditAmount > accounts[user.id].balance) return message.channel.send(`\:moneybag: Insufficient funds, <@${user.id}>!`);
            if(user.id == member.id && !opponentTurn) return message.channel.send(`\:no_entry: It's not your turn yet, <@${member.id}>!`);
            if(user.id == message.author.id && opponentTurn) return message.channel.send(`\:no_entry: It's not your turn yet, <@${message.author.id}>!`);

            // Find position of piece:
            const xPosition = emotes.numbers.findIndex(e => e === reaction.emoji.name);
            let yPosition = -1;
            for(let i=table.length-1; i>-1; i--) {
                if(table[i][xPosition] === emotes.blank) {
                    yPosition = i;
                    break;
                }
            }

            // Guard(s):
            if(yPosition < 0) return message.channel.send(`\:no_entry: No more space there, <@${opponentTurn ? member.id : message.author.id}>!`);

            // Place piece and update embed:
            table[yPosition][xPosition] = opponentTurn ? emotes.player2 : emotes.player1;
            embed.description = `${table.join('\n').replace(/,/g, '')}\n\n${emotes.numbers.join('')}`;
            sentMessage.edit(embed);

            // Check vertical and horizontal winning combinations:
            for(let y=0; y<table.length; y++) {
                for(let x=0; x<table[y].length; x++) {
                    let horizontalMatches = {player1: 0, player2: 0};
                    let verticalMatches = {player1: 0, player2: 0};
                    let diagonalMatches = {player1: 0, player2: 0};

                    // Try to find four matches:
                    for(let i=0; i<4; i++) {
                        if(table?.[y]?.[x + i] === emotes.player1) horizontalMatches.player1++;
                        if(table?.[y]?.[x + i] === emotes.player2) horizontalMatches.player2++;
                        if(table?.[y + i]?.[x] === emotes.player1) verticalMatches.player1++;
                        if(table?.[y + i]?.[x] === emotes.player2) verticalMatches.player2++;
                        if(table?.[y + i]?.[x + i] === emotes.player1 || table?.[y - i]?.[x + i] === emotes.player1) diagonalMatches.player1++;
                        if(table?.[y + i]?.[x + i] === emotes.player2 || table?.[y - i]?.[x + i] === emotes.player2) diagonalMatches.player2++;
                    }

                    // Find winner if there is any:
                    const player1won = horizontalMatches.player1 >= 4 || verticalMatches.player1 >= 4 || diagonalMatches.player1 >= 4;
                    const player2won = horizontalMatches.player2 >= 4 || verticalMatches.player2 >= 4 || diagonalMatches.player2 >= 4;

                    if(player1won || player2won) {
                        collector.stop();
                        accounts[message.author.id].balance += player1won ? creditAmount : -creditAmount;
                        accounts[member.id].balance += player2won ? creditAmount : -creditAmount;
                        if(player1won) return message.channel.send(`\:crown: You won <@${message.author.id}>!`);
                        if(player2won) return message.channel.send(`\:crown: You won <@${member.id}>!`);
                    }
                }
            }

            // Change turn:
            opponentTurn = !opponentTurn;
        });
    }
};
