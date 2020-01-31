const Discord = require('discord.js'); // Node.js package - Discord API
const secret = require('../config.json'); // Secret data

module.exports = {
	name: 'help',
    description: '\:closed_book: Get help!',
    args: false,
    usage: '',
	execute(message, args) {
        let embed = new Discord.RichEmbed();
        embed.setTitle('\:closed_book:')
        embed.setColor('#ff0000');
        
        client.commands.tap(command => {
            embed.addField(secret.prefix + command.name + ' ' + (command.usage ? command.usage : ''), command.description);
        });
        
        message.channel.send(embed);
	}
};