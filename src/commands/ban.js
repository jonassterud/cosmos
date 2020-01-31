module.exports = {
	name: 'ban',
    description: '\:hammer: Ban a user!',
    args: true,
    usage: '<user>',
	execute(message, args) {
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        if(member.bannable && message.member.hasPermission('ADMINISTRATOR')) {
            member.ban(reason);
            message.channel.send("\:hammer: Banned <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
        } else {
            message.channel.send("\:no_entry: You can't ban that person, <@" + message.author.id + ">!");
        }
	}
};