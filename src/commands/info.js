const Discord = require('discord.js'); // Node.js package - Discord API

module.exports = {
	name: 'info',
    description: '\:mag: Get info about a user!',
    args: true,
    usage: '',
	execute(message) {
        const member = message.mentions.members.first();
        let embed = new Discord.RichEmbed();

        embed.setTitle(member.user.tag);
        embed.setThumbnail(member.user.avatarURL);
        embed.setColor('#ff0000');
        embed.addField('Identification:', member.user.id);
        embed.addField('Account created:', member.user.createdAt.toDateString());
        
        message.channel.send(embed);
	}
};