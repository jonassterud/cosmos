module.exports = {
    name: 'raffle',
    description: '\:tada: Create giveaways! (The creator of the giveaway will not be able to participate).',
    args: true,
    usage: '<hh:mm:ss> <item>',
    async execute(message, args) {
        // Guard(s):
        if(!args[1]) return message.channel.send(`\:question: You need to specify what item you are giving away, <@${message.author.id}>!`);

        // Variable(s):
        const regexResult = /(?:(\d*)h)*(?:(\d*)m)*(?:(\d*)s)*/.exec(args[0]);
        const hours = parseFloat(regexResult[1]) || 0;
        const minutes = parseFloat(regexResult[2]) || 0;
        const seconds = parseFloat(regexResult[3]) || 0;
        const item = args.splice(1).join(' ');
        const timeText = `${hours} hour${hours === 1 ? '': 's'}, ${minutes} minute${minutes === 1 ? '' : 's'} and ${seconds} second${seconds === 1 ? '' : 's'}.`;

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
        const waitTime = (1000 * 60 * 60 * hours) + (1000 * 60 * minutes) + (1000 * seconds);
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
