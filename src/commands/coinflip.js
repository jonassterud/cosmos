const fs = require('fs'); // Node.js package - file system
const secret = require('../config.json'); // Secret data

//! NEEDS REFORMATTING
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
        if(member === undefined) {
            // Against computer:
            data[message.guild.id]['users'][message.author.id]['credits'] += (won ? amount : -amount);
            message.channel.send((won ? "\:money_with_wings:" : "\:weary:") + " You " + (won ? "won " : "lost ") + amount + " credits, <@" + message.author.id + ">!");
        } else {
            // Against opponent:
            const bet = data[message.guild.id]['users'][member.id]['coinflip']; 
            if(bet.opponent === message.author.id && bet.amount === amount) { // Check if bet already exists
                // Execute bet:
                data[message.guild.id]['users'][message.author.id]['credits'] += (won ? amount : -amount);
                data[message.guild.id]['users'][member.id]['credits'] += (won ? -amount : amount);
                message.channel.send("\:money_with_wings: You won " + amount + " credits, <@" + (won ? message.author.id : member.id) + ">!");

                // Delete bet:
                data[message.guild.id]['users'][message.author.id]['coinflip']['amount'] = 0;
                data[message.guild.id]['users'][message.author.id]['coinflip']['opponent'] = '';
            } else { // Create bet
                data[message.guild.id]['users'][message.author.id]['coinflip']['amount'] = amount;
                data[message.guild.id]['users'][message.author.id]['coinflip']['opponent'] = member.id;
                message.channel.send("\:white_check_mark: Successfully created bet, <@" + message.author.id + ">!\nTo join <@" + member.id + ">, type: *" + secret.prefix + "coinflip " + amount + " <@" + message.author.id + ">*");
            }
        }

        // Write data:
        return fs.writeFileSync('./data.json', JSON.stringify(data));
	}
};