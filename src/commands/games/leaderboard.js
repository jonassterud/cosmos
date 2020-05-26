module.exports = {
    name: 'leaderboard',
    description: '\:scroll: See the leaderboard',
    args: false,
    usage: '',
    async execute(message) {
        // Create embed:
        const embed = new Discord.MessageEmbed()
            .setTitle('\:scroll: Leaderboard:')
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Sort accounts by balance:
        const sortedArray = Object.keys(accounts).map((e, i) => ({id: e, balance: Object.values(accounts)[i].balance}));
        sortedArray.sort((a, b) => b.balance - a.balance);

        // Fill embed:
        for(let i=0; i<sortedArray.length; i++) {
            const user = await client.users.fetch(sortedArray[i].id);
            embed.addField(`${i + 1}. ${user.tag}`, `${sortedArray[i].balance} credits`);
        }

        // Send embed:
        return message.channel.send(embed);
    }
};
