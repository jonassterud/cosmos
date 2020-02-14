// Get libraries
const secret = require('../config.json'); // Secret data
const request = require('request'); // Node.js package - request webiste data

// Command
module.exports = {
	name: 'gif',
    description: '\:frame_photo: Search for a GIF!',
    args: true,
    usage: '<search query>',
	execute(message, args) {
        request({
            url: 'http://api.giphy.com/v1/gifs/search?api_key=' + secret.giphy + '&q=' + args.join('+').toLowerCase(),
            json: true
        },
        function(e, r, body) {
            // Check for errors:
            if(e) return message.channel.send("\:no_entry: Wasn't able to retrieve any GIFs, <@" + message.author.id + ">!");
            if(!body.data.length) return message.channel.send("\:no_entry: No GIFs were found, <@" + message.author.id + ">!");
            
            // Variables:
            let embed = new Discord.RichEmbed();
            const topSearchLen = (body.data.length*0.25 > 50 ? 50 : body.data.length*0.25);
            const gif = body.data[Math.floor(Math.random() * topSearchLen)];
            
            // Edit embed:
            embed.setColor('#ff0000');
            embed.image = {url: gif.images.downsized.url.replace('media1', 'i')};
            
            // Send embed:
            return message.channel.send(embed);
        });
	}
};
