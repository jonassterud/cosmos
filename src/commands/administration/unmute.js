module.exports = {
    name: 'unmute',
    description: '\:loud_sound: Unmute a user!',
    args: false,
    usage: '<user>',
    async execute(message) {
        // Variable(s):
        const member = message.mentions.members.first();

        // Guard(s):
        if(!member || !message.guild.member(member.id)) return message.channel.send(`\:no_entry: Wasn't able to find that person, <@${message.author.id}>!`);
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`\:no_entry: You can't unmute that person, <@${message.author.id}>!`);

        // Unmute:
        message.guild.channels.cache.each(channel => {
            channel.overwritePermissions([{id: member, allow: ['SEND_MESSAGES', 'SPEAK']}]);
        });

        return message.channel.send(`\:mute: Unmuted <@${member.user.id}>!`);
    }
};
