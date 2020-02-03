const fs = require('fs'); // Node.js package - file system
const secret = require('../config.json'); // Secret data

module.exports = {
	name: 'coinflip',
    description: '\:dollar: Make a coinflip bet!',
    args: true,
    usage: '<amount> <user>',
	execute(message, args) {
        // Variables:
        const member = message.mentions.members.first();
        const amount = parseInt(args[0]);
        const won = Math.floor(Math.random() * 2);
        let data = JSON.parse(fs.readFileSync('./data.json'));

        // Check for errors:
        if(isNaN(amount)) return message.channel.send("\:no_entry: You need to specify the amount of credits you want to bet, <@" + message.author.id + ">!");
        if(amount < 0) return message.channel.send("\:no_entry: Can't bet a negative amount of credits, <@" + message.author.id + ">!");
        if(amount > data[message.guild.id]['users'][message.author.id]['credits']) return message.channel.send("\:moneybag: You don't have enough credits, <@" + message.author.id + ">!");       

        // Execute:
        data[message.guild.id]['users'][message.author.id]['credits'] += (won ? amount : -amount);
        if(member) {
            const bet = data[message.guild.id]['users'][member.user.id]['coinflip'];
            if(bet.opponent == message.author.id && bet.amount == amount) {
                // Bet:
                data[message.guild.id]['users'][member.user.id]['credits'] += (won ? -amount : amount);

                // Delete bet:
                data[message.guild.id]['users'][member.user.id]['coinflip']['amount'] = 0;
                data[message.guild.id]['users'][member.user.id]['coinflip']['opponent'] = "";

                // Respond:
                message.channel.send("\:money_with_wings: You won " + amount + " credits, <@" + (won ? message.author.id : member.user.id) + ">!");
                message.channel.send("\:weary: You lost " + amount + " credits, <@" + (won ? member.user.id : message.author.id) + ">!");
            } else {
                // Bet:
                data[message.guild.id]['users'][message.author.id]['coinflip']['amount'] = amount;
                data[message.guild.id]['users'][message.author.id]['coinflip']['opponent'] = member.user.id;
                
                // Respond:
                message.channel.send("\:white_check_mark: Successfully created bet, <@" + message.author.id + ">!");
                message.channel.send("To join <@" + member.user.id + ">, type: *" + secret.prefix + "coinflip " + amount + " <@" + message.author.id + ">*");
            }
        } else {
            // Respond:
            message.channel.send((won ? "\:money_with_wings:" : "\:weary:") + " You " + (won ? "won " : "lost ") + amount + " credits, <@" + message.author.id + ">!");
        }

        // Write data:
        return fs.writeFileSync('./data.json', JSON.stringify(data));
    }
};