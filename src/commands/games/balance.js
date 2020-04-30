// Command
module.exports = {
    name: 'balance',
    description: '\:moneybag: Check the credit balance of yourself or another user!',
    args: false,
    usage: '(user?)',
    execute (message) {
        // Variables:
        const user = message.mentions.users.first() || message.author;
        const credits = JSON.parse(fs.readFileSync('./data.json'))[message.guild.id].users[user.id].credits;

        // Respond:
        return message.channel.send('<@' + user.id + '> has ' + credits + ' credit' + (credits > 1 ? 's' : '') + '!');
    }
};
