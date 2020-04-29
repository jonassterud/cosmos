// Command
module.exports = {
    name: 'unban',
    description: '\:pensive: Unban a user!',
    args: true,
    usage: '<username>',
    execute (message, args) {
        // Guards:
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("\:no_entry: You can't unban that person, <@" + message.author.id + ">!");

        // Execute:
        message.guild.fetchBans().then(bans => {
            bans.forEach(ban => {
                if((ban.user.username + '#' + ban.user.discriminator) === args[0] || ban.user.id === args[0]) {
                    message.guild.members.unban(ban.user.id);
                    return message.channel.send("\:pensive: Unbanned <@" + ban.user.id + ">!");
                } else {
                    return message.channel.send("\:no_entry: Can't find *\"" + args.join(" ") + "\"*, <@" + message.author.id + ">!");
                }
            });
        });
    }
};
