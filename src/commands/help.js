// Command
module.exports = {
	name: 'help',
    description: '\:closed_book: Get help!',
    args: false,
    usage: '<command name?>',
	execute(message, args) {
        // Variables
        let embed = new Discord.RichEmbed();

        // Execute:
        if(args.length) {
            // Get command:
            const command = client.commands.get(args[0].toLowerCase());
            
            // Check for errors:
            if(!command) return message.channel.send("\:no_entry: Command wasn't found, <@" + message.author.id + ">!");
            
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
        embed.setColor('#ff0000');
        return message.channel.send(embed);        
	}
};