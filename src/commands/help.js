const Discord = require('discord.js'); // Node.js package - Discord API
const secret = require('../config.json'); // Secret data

module.exports = {
	name: 'help',
    description: '\:closed_book: Get help!',
    args: false,
    usage: '',
	execute(message, args) {
        // Create embed:
        let embed = new Discord.RichEmbed();

        if(args.length) {
            // Get command:
            const command = client.commands.get(args[0]);
            if(command === undefined) return message.channel.send("\:no_entry: Command wasn't found, <@" + message.author.id + ">!");
            
            // Edit embed:
            embed.setTitle(command.name);
            embed.addField('Description', command.description + (command.usage ? '\n' + command.usage : ''));
            embed.addField('Format', '`' + secret.prefix + command.name + (command.usage ? ' ' + command.usage : '') + '`');
        } else {
            // Edit embed:
            embed.setTitle('\:closed_book: Command list');
            client.commands.tap(command => {
                embed.addField(secret.prefix + command.name + ' ' + (command.usage ? command.usage : ''), command.description);
            });  
        }
        
        // Send embed:
        embed.setColor('#ff0000');
        message.channel.send(embed);        
	}
};