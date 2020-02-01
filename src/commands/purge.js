module.exports = {
	name: 'purge',
    description: '\:boom: Delete messages!',
    args: true,
    usage: '<amount>',
	execute(message, args) {
        // Check for errors:
        if(isNaN(parseInt(args[0]))) return message.channel.send("\:no_entry: You need to specify the amount of messages you want to delete, <@" + message.author.id + ">!");
        if(parseInt(args[0]) < 0) return message.channel.send("\:no_entry: Can't delete a negative amount of messages, <@" + message.author.id + ">!");
        if(parseInt(args[0]) > 100) return message.channel.send("\:no_entry: Max amount of messages you can delete is 100, <@" + message.author.id + ">!");

        // Execute:
        message.channel.bulkDelete(parseInt(args[0]));
        return message.channel.send("\:boom: Deleted " + parseInt(args[0]) + " messages, <@" + message.author.id + ">!");
	}
};