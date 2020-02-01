const Discord = require('discord.js'); // Node.js package - Discord API
const secret = require('../config.json'); // Secret data
const request = require('request'); // Node.js package - request webiste data

module.exports = {
	name: 'image',
    description: '\:frame_photo: Search for an image!',
    args: true,
    usage: '<search>',
	execute(message, args) {
        request({
            url: 'https://pixabay.com/api/?key=' + secret.pixabay + '&q=' + args.join('+') + '&image_type=photo',
            json: true
        },
        function(e, r, body) {
            // Check for errors:
            if(e) return message.channel.send("\:no_entry: Wasn't able to retrieve any images, <@" + message.author.id + ">!");
            if(!body.hits.length) return message.channel.send("\:no_entry: No images were found, <@" + message.author.id + ">!");
            
            // Variables:
            let embed = new Discord.RichEmbed();
            const image = body.hits[Math.floor(Math.random() * body.hits.length)];
            
            // Edit embed:
            embed.setColor('#ff0000');
            embed.image = {url: image.largeImageURL};
            
            // Send embed:
            return message.channel.send(embed);
        });
	}
};