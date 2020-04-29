// Command
module.exports = {
    name: 'raffle',
    description: '\:tada: Create giveaways!',
    args: true,
    usage: '<hh:mm:ss> <item>',
    execute (message, args) {
        // Guards:
        if(!/^\d\d:\d\d:\d\d$/m.test(args[0]) || args.length <= 1) return;
        if(!args[1]) return;

        // Create raffle:
        const timeArray = args[0].split(':');
        let timeText = ''; // Format text nicely: plural numbers, comma/and, etc. -> bad solution?
        if(parseInt(timeArray[0])) timeText += parseInt(timeArray[0]) + (parseInt(timeArray[0]) > 1 ? ' hours' : ' hour') + (!parseInt(timeArray[2]) ? (!parseInt(timeArray[1]) ? '.' : ' and ') : ', ');
        if(parseInt(timeArray[1])) timeText += parseInt(timeArray[1]) + (parseInt(timeArray[1]) > 1 ? ' minutes' : ' minute') + (!parseInt(timeArray[2]) ? '.' : ' and ');
        if(parseInt(timeArray[2])) timeText += parseInt(timeArray[2]) + (parseInt(timeArray[2]) > 1 ? ' seconds.' : ' second.');
        const item = args.splice(1).join(' ');
        const entryEmbed = new Discord.MessageEmbed()
            .setTitle('\:tada: Raffle - ' + item)
            .setDescription(
                '<@' + message.author.id + '> is giving away ' + item + '!\n' +
                'To join, just react with **any** emoji below.\n' +
                'The giveaway will end in:\n`' + timeText + '`\n' +
                'Good luck! \:+1:'
            )
            .setColor('#ff0000')
            .setTimestamp(new Date());

        message.channel.send(entryEmbed).then(e => {
            // Create collector:
            const filter = (_, user) => user.id != message.author.id;
            const waitTime = (1000 * 60 * 60 * timeArray[0]) + (1000 * 60 * timeArray[1]) + (1000 * timeArray[2]);
            const collector = e.createReactionCollector(filter, {time: waitTime});
            let contestants = [];

            // Collector events:
            collector.on('collect', (_, user) => {
                const id = user.id;
                if(!contestants.includes(id)) contestants.push(id);
            });

            collector.on('end', () => {
                const winner = contestants[Math.floor(Math.random() * contestants.length)];
                const endEmbed = new Discord.MessageEmbed()
                    .setTitle('\:tada: The raffle is over!')
                    .setDescription(contestants.length ? '<@' + winner + '> won ' + item + '!\nContact <@' + message.author.id + '> for your prize!' : 'But nobody entered in time!')
                    .setColor('#ff0000')
                    .setTimestamp(new Date());

                message.channel.send(endEmbed);
            });
        });
    }
};
