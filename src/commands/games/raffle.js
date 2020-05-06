module.exports = {
    name: 'raffle',
    description: '\:tada: Create giveaways! (The creator of the giveaway will not be able to participate).',
    args: true,
    usage: '<hh:mm:ss> <item>',
    async execute(message, args) {
        // Guard(s):
        // TODO: Change from 01:10:20 to 1h10m20s
        if(!/^\d\d:\d\d:\d\d$/m.test(args[0])) return message.channel.send(`\:no_entry: Something went wrong. Type \`${config.prefix}help ${this.name}\`, <@${message.author.id}>!`);
        if(!args[1]) return message.channel.send(`\:question: You need to specify what item you are giving away, <@${message.author.id}>!`);

        // Variable(s):
        const timeArray = args[0].split(':');
        let timeText = ''; // Format text nicely: plural numbers, comma/and, etc. -> bad solution?
        if(parseInt(timeArray[0])) timeText += `${parseInt(timeArray[0])} hour${parseInt(timeArray[0]) > 1 ? 's' : ''}${!parseInt(timeArray[2]) ? (!parseInt(timeArray[1]) ? '.' : ' and ') : ', '}`;
        if(parseInt(timeArray[1])) timeText += `${parseInt(timeArray[1])} minute${parseInt(timeArray[1]) > 1 ? 's' : ''}${!parseInt(timeArray[2]) ? '.' : ' and '}`;
        if(parseInt(timeArray[2])) timeText += `${parseInt(timeArray[2])} second${parseInt(timeArray[2]) > 1 ? 's.' : '.'}`;
        const item = args.splice(1).join(' ');

        // Create entry embed:
        const entryEmbed = new Discord.MessageEmbed()
            .setTitle(`\:tada: Raffle - ${item}`)
            .setDescription(
                `<@${message.author.id}> is giving away ${item}!\n` +
                'To join, just react with **any** emoji below.\n' +
                `The giveaway will end in:\n\`${timeText}\`\n` +
                'Good luck! \:+1:'
            )
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Send entry embed:
        const sentMessage = await message.channel.send(entryEmbed);

        // Create collector:
        const filter = (_, user) => user.id != message.author.id;
        const waitTime = (1000 * 60 * 60 * timeArray[0]) + (1000 * 60 * timeArray[1]) + (1000 * timeArray[2]);
        const collector = await sentMessage.createReactionCollector(filter, {time: waitTime});
        let contestants = [];

        // On reaction:
        collector.on('collect', (_, user) => {
            if(!contestants.includes(user.id)) contestants.push(user.id);
        });

        // On raffle end:
        collector.on('end', () => {
            const winner = contestants[Math.floor(Math.random() * contestants.length)];
            const endEmbed = new Discord.MessageEmbed()
                .setTitle('\:tada: The raffle is over!')
                .setDescription(contestants.length ? `<@${winner}> won ${item}!\nContact <@${message.author.id}> for your prize!` : 'But nobody entered in time!')
                .setColor('#ff0000')
                .setTimestamp(new Date());

            return message.channel.send(endEmbed);
        });
    }
};
