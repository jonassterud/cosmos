// Command
module.exports = {
    name: 'resume',
    description: '\:arrow_forward: Resume the song',
    args: false,
    usage: '',
    execute(message) {
        // Guards:
        if(!queue[message.guild.id] || !queue[message.guild.id].dispatcher) return message.channel.send(`\:question: I'm not playing anything yet, <@${message.author.id}>!`);
        if(!queue[message.guild.id].dispatcher.paused) return message.channel.send(`\:question: I'm not paused, <@${message.author.id}>!`);

        // Resume:
        queue[message.guild.id].dispatcher.resume();
        return message.channel.send(`\:arrow_forward: Resumed song, <@${message.author.id}>!`);
    }
};
