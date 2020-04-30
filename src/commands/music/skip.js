// Command
module.exports = {
    name: 'skip',
    description: '\:arrow_right: Skip forward in the queue!',
    args: false,
    usage: '(amount?)',
    execute(message, args) {
        // Guard:
        if(!queue[message.guild.id] || !queue[message.guild.id].connection) return message.channel.send("\:question: I'm not playing anything yet, <@" + message.author.id + '>!');

        // Skip:
        if(args[1] && /^\d+$/m.test(args[1])) {
            if(parseInt(args[1]) <= queue[message.guild.id].urls.length && args[1] > 0) {
                queue[message.guild.id].urls.splice(0, parseInt(args[1]) - 1);
                queue[message.guild.id].dispatcher.end();
            } else {
                message.channel.send('\:no_entry: Number is out of range, <@' + message.author.id + '>!');
            }
        } else {
            queue[message.guild.id].dispatcher.end();
        }
    }
};
