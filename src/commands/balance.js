const fs = require('fs'); // Node.js package - file system

module.exports = {
	name: 'balance',
    description: '\:moneybag: balance!',
    args: false,
    usage: '<user>',
	execute(message) {
        // Variables:
        const user = ((message.mentions.users.first() === undefined) ? message.author : message.mentions.users.first());
        const data = JSON.parse(fs.readFileSync('./data.json'));

        // Execute:
        return message.channel.send("<@" + user.id + "> has " + data[message.guild.id]['users'][user.id]['credits'] + " credits!");
	}
};