module.exports = {
	name: 'mute',
    description: '\:mute: Mute a user!',
    args: true,
    usage: '<user>',
	execute(message, args) {
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        if(message.member.hasPermission('ADMINISTRATOR')) {
            member.setMute(true, reason);
            message.channel.send("\:mute: Muted <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
        } else {
            message.channel.send("\:no_entry: You can't mute that person, <@" + message.author.id + ">!");
        }
	}
};