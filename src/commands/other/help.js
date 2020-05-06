module.exports = {
    name: 'help',
    description: '\:closed_book: See all available commands or get help on a specific command!',
    args: false,
    usage: '(command?)',
    async execute(message, args) {
        // Create embed:
        const embed = new Discord.MessageEmbed()
            .setColor('#ff0000');

        // Check if specific command is specified:
        if(args.length) {
            // Get command from client:
            const command = client.commands.get(args[0].toLowerCase());

            // Guard(s):
            if(!command) return message.channel.send(`\:no_entry: Command wasn't found, <@${message.author.id}>!`);

            // Edit embed:
            embed.setTitle(command.name);
            embed.addField('Description', command.description);
            embed.addField('Format', `\`${config.prefix + command.name} ${command.usage ? command.usage : ''}\``);
        } else {
            // Edit embed:
            embed.setTitle('\:closed_book: Command list');
            client.commands.each(command => {
                embed.addField(`${config.prefix + command.name} ${command.usage ? command.usage : ''}`, command.description);
            });
        }

        // Send embed:
        return message.channel.send(embed);
    }
};
