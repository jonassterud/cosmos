module.exports = {
    name: 'hello',
    description: '\:wave: Use this command to check the latency of the bot!',
    args: false,
    usage: '',
    async execute(message) {
        return message.channel.send(`\:wave: Hello, <@${message.author.id}>! I have a latency of ${Date.now() - message.createdTimestamp}ms.`);
    }
};
