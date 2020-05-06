module.exports = {
    name: 'image',
    description: '\:frame_photo: Search for an image!',
    args: true,
    usage: '<query>',
    async execute(message, args) {
        https.get(`https://pixabay.com/api/?key=${process.env.PIXABAY}&q=${args.join('+').toLowerCase()}&image_type=photo`, response => {
            let body = '';
            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                // Parse data:
                body = JSON.parse(body);

                // Guard(s):
                if(!body.hits.length) return message.channel.send(`\:no_entry: No images were found, <@${message.author.id}>!`);

                // Select image and create embed:
                const topSearchLen = (body.hits.length * 0.25 > 50 ? 50 : Math.round(body.hits.length * 0.25));
                const image = body.hits[Math.floor(Math.random() * topSearchLen)];
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setImage(image.largeImageURL);

                // Send embed:
                return message.channel.send(embed);
            });
        }).on('error', error => {
            client.logger.error(error);
            return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
        });
    }
};
