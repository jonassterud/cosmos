module.exports = {
    name: 'coinflip',
    description: '\:dollar: Make a coinflip bet with the bot or against other user(s)!',
    args: true,
    usage: '<credit amount> (max users?)',
    async execute(message, args) {
        // Variable(s):
        const creditAmount = parseInt(args[0]);
        const maxUsers = parseInt(args[1]);

        // Guard(s):
        if(!accounts?.[message.author.id]) return message.channel.send(`\:no_entry: Create an account first with \`${config.prefix}account\`, <@${message.author.id}>!`);
        if(isNaN(creditAmount)) return message.channel.send(`\:no_entry: Credit amount should be a number, <@${message.author.id}>!`);
        if(args[1] && isNaN(maxUsers)) return message.channel.send(`\:no_entry: Max users should be a number, <@${message.author.id}>!`);
        if(creditAmount > accounts[message.author.id].balance) return message.channel.send(`\:moneybag: Insufficient funds, <@${message.author.id}>!`);

        // Check if game is open to other players:
        if(args[1]) {
            // Deduct credits from host:
            accounts[message.author.id].balance -= creditAmount;

            // Create entry embed:
            const entryEmbed = new Discord.MessageEmbed()
                .setTitle(`\:dollar: Coinflip - ${creditAmount} credits`)
                .setDescription(
                    `<@${message.author.id}> has created a coinflip for ${creditAmount} credits!\n` +
                    'To join, just react with **any** emoji below.\n' +
                    `Maximum ${maxUsers} users can join this coinflip.\n` +
                    'The coinflip will end in:\n`60` seconds.\n' +
                    'Good luck! \:+1:'
                )
                .setColor('#ff0000')
                .setTimestamp(new Date());

            // Send entry embed:
            const sentMessage = await message.channel.send(entryEmbed);

            // Create collector:
            let contestants = [message.author.id];
            const filter = (_, user) => user.id != message.author.id && !contestants.includes(user.id);
            const collector = await sentMessage.createReactionCollector(filter, {time: 1000 * 60});

            // On reaction:
            collector.on('collect', (_, user) => {
                if(!Object.prototype.hasOwnProperty.call(accounts, user.id)) {
                    return message.channel.send(`\:no_entry: Please create an account first with \`${config.prefix}account\`, <@${user.id}>!`);
                } else if(creditAmount > accounts[user.id].balance) {
                    return message.channel.send(`\:no_entry: Insufficient funds, <@${user.id}>!`);
                } else if(contestants.length >= maxUsers) {
                    return message.channel.send(`\:no_entry: No more spots, <@${user.id}>!`);
                } else {
                    // Push contestant and deduct credits:
                    contestants.push(user.id);
                    accounts[user.id].balance -= creditAmount;
                }
            });

            // On raffle end:
            collector.on('end', () => {
                // Choose winner and create end embed:
                const winner = contestants[Math.floor(Math.random() * contestants.length)];
                const endEmbed = new Discord.MessageEmbed()
                    .setTitle('\:dollar: The coinflip is over!')
                    .setDescription(`<@${winner}> won ${creditAmount * (contestants.length - 1)} credits!`)
                    .setColor('#ff0000')
                    .setTimestamp(new Date());

                // Give winner credits and send end embed:
                accounts[winner].balance += creditAmount * contestants.length;
                return message.channel.send(endEmbed);
            });
        } else {
            // Deduct/add credits:
            const won = Math.floor(Math.random() * 2);
            accounts[message.author.id].balance += won ? creditAmount : -creditAmount;

            // Send result message:
            return message.channel.send(`${won ? '\:dollar: You won' : '\:skull: You lost'} ${creditAmount} credits, <@${message.author.id}>!`);
        }
    }
};
