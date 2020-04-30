// Global variables
const bets = [];

// Command
module.exports = {
    name: 'coinflip',
    description: '\:dollar: Make a coinflip bet with the bot or against another user!',
    args: true,
    usage: '<credit amount> (user?)',
    execute(message, args) {
        // Variables:
        const member = message.mentions.members.first();
        const amount = parseFloat(args[0]);
        const won = Math.floor(Math.random() * 2);
        const data = JSON.parse(fs.readFileSync('./data.json'));

        // Guards:
        if(isNaN(amount)) return message.channel.send('\:question: You need to specify the amount of credits you want to bet, <@' + message.author.id + '>!');
        if(amount < 0) return message.channel.send("\:question: Can't bet a negative amount of credits, <@" + message.author.id + '>!');
        if(amount > data[message.guild.id].users[message.author.id].credits) return message.channel.send("\:moneybag: You don't have enough credits, <@" + message.author.id + '>!');

        // Create coinflip:
        if(!member) {
            data[message.guild.id].users[message.author.id].credits += (won ? amount : -amount);
            message.channel.send((won ? '\:money_with_wings:' : '\:skull:') + ' You ' + (won ? 'won ' : 'lost ') + amount + ' credits, <@' + message.author.id + '>!');
        } else {
            // Check for bet:
            let foundBet = false;
            bets.forEach(bet => {
                if(bet.self === member.user.id && bet.opponent === message.author.id && bet.value === amount) {
                    foundBet = true;
                }
            });

            // Execute 2 player bet:
            if(foundBet) {
                data[message.guild.id].users[message.author.id].credits += (won ? amount : -amount);
                data[message.guild.id].users[member.user.id].credits += (won ? -amount : amount);
                message.channel.send('\:money_with_wings:<@' + (won ? message.author.id : member.user.id) + '> won ' + amount + ' credits!');
                message.channel.send('\:money_with_wings:<@' + (won ? member.user.id : message.author.id) + '> lost ' + amount + ' credits!');
            } else {
                bets.push({ self: message.author.id, opponent: member.user.id, value: amount });
                message.channel.send('\:+1: Successfully created bet, <@' + message.author.id + '>!');
                message.channel.send('To join <@' + member.user.id + '>, type: *' + config.prefix + 'coinflip ' + amount + ' <@' + message.author.id + '>*');
            }
        }

        // Write data:
        return fs.writeFileSync('./data.json', JSON.stringify(data));
    }
};
