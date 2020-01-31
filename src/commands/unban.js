module.exports = {
	name: 'unban',
    description: '\:pensive: Unban a user!',
    args: true,
    usage: '<user>',
	execute(message, args) {
        const member = message.mentions.members.first();
        //const reason = args.splice(1).join(' ');

        if(message.member.hasPermission('ADMINISTRATOR' /* && */) ) {
            
            //message.channel.send("\:pensive: Unbanned <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
        } else {
            //message.channel.send("\:no_entry: You can't unban that person, <@" + message.author.id + ">!");
        }
	}
};