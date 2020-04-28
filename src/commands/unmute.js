// Command
module.exports = {
    name: 'unmute',
    description: '\:loud_sound: Unmute a user!',
    args: true,
    usage: '<user mention>',
    execute (message, args) {
        message.channel.send('Under construction..');
    /*
        // Variables:
        const member = message.mentions.members.first();
        const reason = args.splice(1).join(' ');

        // Check for errors:
        if(!member || !message.guild.member(member.id)) return message.channel.send("\:no_entry: Wasn't able to find that person, <@" + message.author.id + ">!");
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("\:no_entry: You can't unmute that person, <@" + message.author.id + ">!");

        // Execute:
        //...

        return message.channel.send("\:mute: Unmuted <@" + member.user.id + ">" + (reason.length > 0 ? " for " + reason : "") + "!");
        */
    }
};
