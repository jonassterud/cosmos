module.exports = {
    name: 'fact',
    description: '\:nerd: Get a random fact!',
    args: false,
    usage: '',
    async execute(message) {
        https.get('https://uselessfacts.jsph.pl/random.json?language=en', response => {
            let body = '';
            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                // Parse data:
                body = JSON.parse(body);

                // Create embed:
                const embed = new Discord.MessageEmbed()
                    .setDescription(body.text)
                    .setColor('#ff0000')
                    .setTimestamp(new Date());

                // Send embed:
                return message.channel.send(embed);
            });
        }).on('error', error => {
            client.logger.error(error);
            return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
        });
    }
};
