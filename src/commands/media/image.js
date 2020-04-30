// Command
module.exports = {
    name: 'image',
    description: '\:frame_photo: Search for an image!',
    args: true,
    usage: '<query>',
    execute(message, args) {
        request({
            url: 'https://pixabay.com/api/?key=' + process.env.PIXABAY + '&q=' + args.join('+').toLowerCase() + '&image_type=photo',
            json: true
        },
        (e, r, body) => {
            // Guards:
            if(e) return message.channel.send("\:no_entry: Wasn't able to retrieve any images, <@" + message.author.id + '>!');
            if(!body.hits.length) return message.channel.send('\:no_entry: No images were found, <@' + message.author.id + '>!');

            // Variables:
            const topSearchLen = (body.hits.length * 0.25 > 50 ? 50 : Math.round(body.hits.length * 0.25));
            const image = body.hits[Math.floor(Math.random() * topSearchLen)];

            // Create embed:
            const embed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setImage(image.largeImageURL);

            // Send embed:
            return message.channel.send(embed);
        });
    }
};
