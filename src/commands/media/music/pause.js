module.exports = {
    name: 'pause',
    description: '\:pause_button: Pause the song!',
    args: false,
    usage: '',
    async execute(message) {
        // Guard(s):
        if(!queue?.[message.guild.id] || !queue?.[message.guild.id]?.dispatcher) return message.channel.send(`\:question: I'm not playing anything yet, <@${message.author.id}>!`);
        if(queue[message.guild.id].dispatcher.paused) return message.channel.send(`\:question: I'm already paused, <@${message.author.id}>!`);

        // Pause:
        queue[message.guild.id].dispatcher.pause(true);
        return message.channel.send(`\:pause_button: Paused song, <@${message.author.id}>!`);
    }
};
