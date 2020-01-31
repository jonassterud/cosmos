module.exports = {
	name: 'kick',
    description: '\:pick: Kick a user!',
    args: true,
    usage: '<user>',
	execute(message, args) {
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        if(member.kickable && message.member.hasPermission('ADMINISTRATOR')) {
            member.kick(reason);
            message.channel.send("\:pick: Kicked <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
        } else {
            message.channel.send("\:no_entry: You can't kick that person, <@" + message.author.id + ">!");
        }
	}
};