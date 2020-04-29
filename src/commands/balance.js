// Command
module.exports = {
    name: 'balance',
    description: '\:moneybag: Check the credit balance of yourself or another user!',
    args: false,
    usage: '(user?)',
    execute (message) {
        // Variables:
        const user = ((message.mentions.users.first() === undefined) ? message.author : message.mentions.users.first());
        const credits = JSON.parse(fs.readFileSync('./data.json'))[message.guild.id].users[user.id].credits;

        // Execute:
        return message.channel.send('<@' + user.id + '> has ' + credits + ' credit' + ((credits === 1) ? '' : 's') + '!');
    }
};
