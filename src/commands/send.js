// Command
module.exports = {
    name: 'send',
    description: '\:money_with_wings: Send money to another user!',
    args: true,
    usage: '<credit amount> <user mention>',
    execute (message, args) {
        // Variables:
        const member = message.mentions.members.first();
        const amount = parseFloat(args[0]);
        const data = JSON.parse(fs.readFileSync('./data.json'));

        // Check for errors:
        if(isNaN(amount)) return message.channel.send('\:no_entry: You need to specify the amount of credits you want to bet, <@' + message.author.id + '>!');
        if(amount < 0) return message.channel.send("\:no_entry: Can't bet a negative amount of credits, <@" + message.author.id + '>!');
        if(amount > data[message.guild.id].users[message.author.id].credits) return message.channel.send("\:moneybag: You don't have enough credits, <@" + message.author.id + '>!');

        // Execute:
        data[message.guild.id].users[message.author.id].credits -= amount;
        data[message.guild.id].users[member.user.id].credits += amount;
        message.channel.send('\:money_with_wings: <@' + message.author.id + '> sent ' + amount + ' credits to <@' + member.user.id + '>!');

        // Write data:
        return fs.writeFileSync('./data.json', JSON.stringify(data));
    }
};
