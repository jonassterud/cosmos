module.exports = {
	name: 'unmute',
    description: '\:loud_sound: Unmute a user!',
    args: true,
    usage: '<user>',
	execute(message, args) {
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        if(message.member.hasPermission('ADMINISTRATOR')) {
            member.setMute(false, reason);
            message.channel.send("\:loud_sound: Unmuted <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
        } else {
            message.channel.send("\:no_entry: You can't unmute that person, <@" + message.author.id + ">!");
        }
	}
};