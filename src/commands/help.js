const secret = require('../config.json'); // Secret data

module.exports = {
	name: 'help',
    description: '\:closed_book: Get help!',
    args: false,
    usage: '',
	execute(message, args) {
        // Variables
        let embed = new Discord.RichEmbed();

        // Execute:
        embed.setColor('#ff0000');
        if(args.length) {
            // Get command:
            const command = client.commands.get(args[0]);
            
            // Check for errors:
            if(command === undefined) return message.channel.send("\:no_entry: Command wasn't found, <@" + message.author.id + ">!");
            
            // Edit embed:
            embed.setTitle(command.name);
            embed.addField('Description', command.description);
            embed.addField('Format', '`' + secret.prefix + command.name + (command.usage ? ' ' + command.usage : '') + '`');
        } else {
            // Edit embed:
            embed.setTitle('\:closed_book: Command list');
            client.commands.tap(command => {
                embed.addField(secret.prefix + command.name + ' ' + (command.usage ? command.usage : ''), command.description);
            });  
        }
        
        // Send embed:
        return message.channel.send(embed);        
	}
};