// Command
module.exports = {
    name: 'balance',
    description: '\:moneybag: balance!',
    args: false,
    usage: '<user mention?>',
    execute (message) {
        // Variables:
        const user = ((message.mentions.users.first() === undefined) ? message.author : message.mentions.users.first());
        const credits = JSON.parse(fs.readFileSync('./data.json'))[message.guild.id].users[user.id].credits;

        // Execute:
        return message.channel.send('<@' + user.id + '> has ' + credits + ' credit' + ((credits === 1) ? '' : 's') + '!');
    }
};
