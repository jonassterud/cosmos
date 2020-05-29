module.exports = {
    name: 'reset',
    description: '\:fire: Reset the queue!',
    args: false,
    usage: '',
    async execute(message) {
        // Guard(s):
        if(!queue?.[message.guild.id]) return message.channel.send(`\:question: There is nothing to reset, <@${message.author.id}>!`);

        // Reset:
        queue[message.guild.id].urls = [];
        queue[message.guild.id].dispatcher.end();
    }
};
