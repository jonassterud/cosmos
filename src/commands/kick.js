// Command
module.exports = {
    name: 'kick',
    description: '\:pick: Kick a user!',
    args: true,
    usage: '<user> (reason?)',
    execute (message, args) {
    // Variables:
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        // Check for errors:
        if(!member || !message.guild.member(member.id)) return message.channel.send("\:no_entry: Wasn't able to find that person, <@" + message.author.id + '>!');
        if(!member.kickable || !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("\:no_entry: You can't kick that person, <@" + message.author.id + '>!');

        // Execute:
        member.kick(reason);
        return message.channel.send('\:pick: Kicked <@' + member.user.id + '>' + (reason.length > 0 ? ' for ' + reason : '') + '!');
    }
};
