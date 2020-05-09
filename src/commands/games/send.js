module.exports = {
    name: 'send',
    description: '\:money_with_wings: Send credits to another user!',
    args: true,
    usage: '<credit amount> <user>',
    async execute(message, args) {
        // Variable(s):
        const member = message.mentions.members.first();
        const sendAmount = parseInt(args[0]);

        // Guard(s):
        if(!Object.prototype.hasOwnProperty.call(accounts, message.author.id)) return message.channel.send(`\:no_entry: Create an account first with \`${config.prefix}account\`, <@${message.author.id}>!`);
        if(!Object.prototype.hasOwnProperty.call(accounts, member.id)) return message.channel.send(`\:no_entry: <@${member.id}> doesn't have an account yet. Create an account with \`${config.prefix}account\`!`);
        if(isNaN(sendAmount)) return message.channel.send(`\:question: You need to specify the amount of credits you want to bet, <@${message.author.id}>!`);
        if(sendAmount < 0) return message.channel.send(`\:question: Can't send a negative amount of credits, <@${message.author.id}>!`);
        if(sendAmount > accounts[message.author.id].balance) return message.channel.send(`\:moneybag: Insufficient funds, <@${message.author.id}>!`);

        // Send credit(s):
        accounts[message.author.id].balance -= sendAmount;
        accounts[member.user.id].balance += sendAmount;
        message.channel.send(`\:money_with_wings: <@${message.author.id}> sent ${sendAmount} credits to <@${member.user.id}>!`);
    }
};
