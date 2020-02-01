const Discord = require('discord.js'); // Node.js package - Discord API
const secret = require('../config.json'); // Secret data

module.exports = {
	name: 'help',
    description: '\:closed_book: Get help!',
    args: false,
    usage: '',
	execute(message, args) {
        let embed = new Discord.RichEmbed();
        embed.setColor('#ff0000');

        if(args.length) {
            const command = client.commands.get(args[0]);
            embed.setTitle(command.name);
            embed.addField('Description', command.description + (command.usage ? '\n' + command.usage : ''));
            embed.addField('Format', '`' + secret.prefix + command.name + (command.usage ? ' ' + command.usage : '') + '`');
        } else {
            embed.setTitle('\:closed_book: Command list');
            client.commands.tap(command => {
                embed.addField(secret.prefix + command.name + ' ' + (command.usage ? command.usage : ''), command.description);
            });  
        }

        message.channel.send(embed);        
	}
};