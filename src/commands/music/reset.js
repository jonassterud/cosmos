// Command
module.exports = {
    name: 'reset',
    description: '\:fire: Reset the queue!',
    args: false,
    usage: '',
    execute(message) {
        // Guard:
        if(!queue[message.guild.id]) return message.channel.send('\:no_entry: There is nothing to reset, <@' + message.author.id + '>!');

        // Reset:
        queue[message.guild.id].urls = [];
        queue[message.guild.id].dispatcher.end();
    }
};
