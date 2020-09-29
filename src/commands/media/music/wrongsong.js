module.exports = {
    name: 'wrongsong',
    description: '\:chair: Remove recently added song!',
    args: false,
    usage: '',
    async execute(message) {
        // Guard(s):
        if(!queue?.[message.guild.id] || !queue?.[message.guild.id]?.urls) return message.channel.send(`\:question: Queue is empty, <@${message.author.id}>!`);

        // Remove last song:
        const data = await ytdl.getBasicInfo(queue[message.guild.id].urls.pop());
        return message.channel.send(`\:open_mouth: Removed "*${data.videoDetails.title}*" from the queue, <@${message.author.id}>!`);
    }
};
