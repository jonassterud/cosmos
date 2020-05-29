module.exports = {
    name: 'skip',
    description: '\:arrow_right: Skip forward in the queue!',
    args: false,
    usage: '(amount?)',
    async execute(message, args) {
        // Variable(s):
        const amount = parseInt(args[0]) || 1;

        // Guard(s):
        if(!queue?.[message.guild.id] || !queue?.[message.guild.id]?.connection) return message.channel.send(`\:question: I'm not playing anything yet, <@${message.author.id}>!`);

        // Skip:
        if(amount <= queue[message.guild.id].urls.length && amount > 0) {
            queue[message.guild.id].urls.splice(0, amount - 1);
            return queue[message.guild.id].dispatcher.end();
        } else {
            return message.channel.send(`\:no_entry: Number is out of range, <@${message.author.id}>!`);
        }
    }
};
