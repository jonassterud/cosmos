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
            url: 'https://pixabay.com/api/?key=15021305-24a039485a0548601948251b0&q=' + args.join('+') + '&image_type=photo',
            json: true
        },
        function(e, r, body) {
            // Errors:
            if(e) return message.channel.send("Wasn't able to retrieve any images, <@" + message.author.id + ">!");
            if(!body.hits.length) return message.channel.send("No images were found, <@" + message.author.id + ">!");
            
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