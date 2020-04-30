// Command
module.exports = {
    name: 'queue',
    description: '\:musical_note: See the music queue!',
    args: false,
    usage: '',
    execute(message) {
        if(!queue[message.guild.id] || !queue[message.guild.id].urls) return message.channel.send('\:no_entry: Queue is empty, <@' + message.author.id + '>!');

        // Create embed:
        const embed = new Discord.MessageEmbed()
            .setTitle('Song queue \:musical_note:')
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Loop trough songs:
        const maxSize = 3;
        (async function addItems () {
            for(let i = 0; i < queue[message.guild.id].urls.length && i < maxSize; i++) {
                await ytdl.getBasicInfo(queue[message.guild.id].urls[i], (err, data) => {
                    if(err) {
                        embed.addField((!i ? 'Currently playing' : i + '.'), 'Title: *Unknown*\nDuration: *Unknown*');
                    } else {
                        const length = parseInt(data.length_seconds);
                        embed.addField((!i ? 'Currently playing:' : i + '.'), 'Title: *' + data.title + '*\nDuration: *' + Math.floor(length / 60) + ' minutes and ' + length % 60 + ' seconds' + '*');
                    }
                });
            }
        })().then(() => {
            // Show remaining songs:
            const remaining = queue[message.guild.id].urls.length - maxSize;
            if(remaining > 0) embed.addField('...', 'and ' + remaining + ' more!');
            message.channel.send(embed);
        });
    }
};
