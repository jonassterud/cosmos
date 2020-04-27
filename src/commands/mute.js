// Command
module.exports = {
	name: 'mute',
    description: '\:mute: Mute a user!',
    args: true,
    usage: '<user mention> <reason?>',
	execute(message, args) {
        // Variables:
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        // Check for errors:
        if(!member || !message.guild.member(member.id)) return message.channel.send("\:no_entry: Wasn't able to find that person, <@" + message.author.id + ">!");
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("\:no_entry: You can't mute that person, <@" + message.author.id + ">!");

        // Execute:
        message.guild.channels.tap(channel => {
            channel.overwritePermissions(member, {
                SEND_MESSAGES: false
            });
        });
        
        return message.channel.send("\:mute: Muted <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
	}
};
