module.exports = {
	name: 'unban',
    description: '\:pensive: Unban a user!',
    args: true,
    usage: '<user>',
	execute(message, args) {
        
        if(message.member.hasPermission('ADMINISTRATOR')) {
            let flag = false;
            const toUnban = args.join(" ");
            message.guild.fetchBans().then(bans => {
                bans.forEach(user => {
		if(user.username == toUnban){
                    message.guild.unban(user);
                    flag = true;
                    return message.channel.send("\:pensive: Unbanned <@" + toUnban.user.id + ">!");
		    }
                });
                if(!flag) return message.channel.send("There is no banned user with the name "+toUnban);
            });
        } else {
            message.channel.send("\:no_entry: You can't unban that person, <@" + message.author.id + ">!");
        }
        
	}
};
