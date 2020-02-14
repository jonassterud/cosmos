// Command
module.exports = {
	name: 'hello',
    description: '\:wave: Hello!',
    args: false,
    usage: '',
	execute(message) {
        return message.channel.send("\:wave: Hello, <@" + message.author.id + ">!");
	}
};