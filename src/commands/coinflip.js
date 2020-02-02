const fs = require('fs'); // Node.js package - file system

module.exports = {
	name: 'coinflip',
    description: '\:dollar: Make a coinflip bet!',
    args: false,
    usage: '<user>',
	execute(message, args) {
        // Variables:
        const data = JSON.parse(fs.readFileSync('./data.json'));
        const amount = parseInt(args[0]);

        // Check for errors:
        if(isNaN(amount)) return message.channel.send("\:no_entry: You need to specify the amount of credits you want to bet, <@" + message.author.id + ">!");
        if(amount < 0) return message.channel.send("\:no_entry: Can't bet a negative amount of credits, <@" + message.author.id + ">!");
        if(amount > data[message.guild.id]['users'][message.author.id]['credits']) return message.channel.send("\:moneybag: You don't have enough credits, <@" + message.author.id + ">!");       

        // Execute:
        const won = Math.floor(Math.random() * 2);
        data[message.guild.id]['users'][message.author.id]['credits'] += (won ? amount : -amount);
        message.channel.send((won ? "\:money_with_wings:" : "\:weary:") + " You " + (won ? "won " : "lost ") + amount + " credits, <@" + message.author.id + ">!");

        // Write data:
        return fs.writeFileSync('./data.json', JSON.stringify(data));
	}
};