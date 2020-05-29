module.exports = {
    name: 'stock',
    description: '\:chart: Get data on stocks!',
    args: true,
    usage: '<ticker>',
    async execute(message, args) {
        // Fetch data:
        let data = '';
        try { data = await finance.data.weekly(args[0], 'full'); }
        catch(_) { return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`); }

        // Calculate changes:
        const weeklyPrices = Object.values(data['Weekly Time Series']).map(e => parseFloat(e['4. close']));
        const change7 = ((weeklyPrices[0] / weeklyPrices[1]) - 1) * 100 || 'Unavailable';
        const change30 = ((weeklyPrices[0] / weeklyPrices[3]) - 1) * 100 || 'Unavailable';
        const change90 = ((weeklyPrices[0] / weeklyPrices[12]) - 1) * 100 || 'Unavailable';
        const change365 = ((weeklyPrices[0] / weeklyPrices[51]) - 1) * 100 || 'Unavailable';

        // Create embed:
        const lastDate = moment(Object.keys(data['Weekly Time Series'])[0], 'YYYY-MM-DD').format('DD-MM-YYYY');
        const embed = new Discord.MessageEmbed()
            .setTitle(`$${args[0].toUpperCase()} stock`)
            .setDescription(`Price as of ${lastDate}: $${weeklyPrices[0]}`)
            .addField(`7 day change ($${weeklyPrices[1]}):`, `${change7.toFixed(2)}%`)
            .addField(`30 day change ($${weeklyPrices[3]}):`, `${change30.toFixed(2)}%`)
            .addField(`90 day change ($${weeklyPrices[12]}):`, `${change90.toFixed(2)}%`)
            .addField(`365 day change ($${weeklyPrices[51]}):`, `${change365.toFixed(2)}%`)
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Send embed:
        return message.channel.send(embed);
    }
};
