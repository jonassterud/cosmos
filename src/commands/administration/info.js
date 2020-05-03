// Command
module.exports = {
    name: 'info',
    description: '\:mag: Get info about a user!',
    args: true,
    usage: '<user>',
    async execute(message) {
        // Variables:
        const member = message.mentions.members.first();

        // Guard:
        if(!member || !message.guild.member(member.id)) return message.channel.send(`\:no_entry: Wasn't able to find that person, <@${message.author.id}>!`);

        // Create embed:
        const embed = new Discord.MessageEmbed()
            .setTitle(member.user.tag)
            .setThumbnail(member.user.avatarURL)
            .addField('Identification:', member.user.id)
            .addField('Account created:', member.user.createdAt.toDateString())
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Send embed:
        return message.channel.send(embed);
    }
};
