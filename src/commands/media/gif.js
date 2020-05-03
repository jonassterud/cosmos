// Command
module.exports = {
    name: 'gif',
    description: '\:frame_photo: Search for a GIF!',
    args: true,
    usage: '<query>',
    async execute(message, args) {
        http.get(`http://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY}&q=${args.join('+').toLowerCase()}&limit=15`, response => {
            let body = '';
            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                // Parse data:
                body = JSON.parse(body);

                // Guard:
                if(!body.data.length) return message.channel.send(`\:no_entry: No GIFs were found, <@${message.author.id}>!`);

                // Select GIF:
                const gif = body.data[Math.floor(Math.random() * body.data.length)];

                // Create embed:
                const embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setImage(gif.images.downsized.url.replace('media1', 'i'));

                // Send embed:
                return message.channel.send(embed);
            });
        }).on('error', error => {
            client.logger.error(error);
            return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
        });
    }
};
