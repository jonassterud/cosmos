// Command
module.exports = {
    name: 'gif',
    description: '\:frame_photo: Search for a GIF!',
    args: true,
    usage: '<query>',
    execute(message, args) {
        request({
            url: 'http://api.giphy.com/v1/gifs/search?api_key=' + process.env.GIPHY + '&q=' + args.join('+').toLowerCase() + '&limit=15',
            json: true
        },
        (e, r, body) => {
            // Guards:
            if(e) return message.channel.send("\:no_entry: Wasn't able to retrieve any GIFs, <@" + message.author.id + '>!');
            if(!body.data.length) return message.channel.send('\:no_entry: No GIFs were found, <@' + message.author.id + '>!');

            // Variables:
            const embed = new Discord.MessageEmbed();
            const gif = body.data[Math.floor(Math.random() * body.data.length)];

            // Edit embed:
            embed.setColor('#ff0000');
            embed.image = { url: gif.images.downsized.url.replace('media1', 'i') };

            // Send embed:
            return message.channel.send(embed);
        });
    }
};
