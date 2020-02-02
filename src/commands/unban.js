module.exports = {
	name: 'unban',
    description: '\:pensive: Unban a user!',
    args: true,
    usage: '<username>',
	execute(message, args) {
        // Check for errors:
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("\:no_entry: You can't unban that person, <@" + message.author.id + ">!");

        // Execute:
        let foundUser = false;
        message.guild.fetchBans().then(bans => {
            bans.forEach(user => {
                if(user.username === args.join(" ")){
                    foundUser = true;
                    message.guild.unban(user);
                    return message.channel.send("\:pensive: Unbanned <@" + user.id + ">!");
                }
            });
        });
        if(!foundUser) return message.channel.send("Can't find " + user.username + ", <@" + message.author.id + ">!");
	}
};
