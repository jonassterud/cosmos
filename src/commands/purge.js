module.exports = {
	name: 'purge',
    description: '\:boom: Delete messages!',
    args: true,
    usage: '<amount>',
	execute(message, args) {
        // Variables:
        const amount = parseInt(args[0]);

        // Check for errors:
        if(isNaN(amount)) return message.channel.send("\:no_entry: You need to specify the amount of messages you want to delete, <@" + message.author.id + ">!");
        if(amount < 0) return message.channel.send("\:no_entry: Can't delete a negative amount of messages, <@" + message.author.id + ">!");
        if(amount > 100) return message.channel.send("\:no_entry: Max amount of messages you can delete is 100, <@" + message.author.id + ">!");

        // Execute:
        message.channel.bulkDelete(amount);
        return message.channel.send("\:boom: Deleted " + amount + " message" + ((amount > 1) ? "s" : "") + ", <@" + message.author.id + ">!");
	}
};