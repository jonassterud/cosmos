// Command
module.exports = {
    name: 'raffle',
    description: '\:tada: Create giveaways!',
    args: true,
    usage: '<hh:mm:ss> <item>',
    execute (message, args) {
        message.channel.send('Under construction..');
    /*
        const guild = message.guild.id;
        const auth = message.author.id;
        const re = /^(\d\d:\d\d:\d\d)$/;
        if(!re.test(args[0]) || args.length <= 1) return;
        const nums = args[0].split(":");
        const creator = message.author;
        let creditGiveaway = false;
        const decideType = /^(\d)+/;
        let data = JSON.parse(fs.readFileSync('./data.json'));
        let testString = "";

        args.slice(1).forEach(inner => testString += inner);
        creditGiveaway = decideType.test(testString);
        if(creditGiveaway && Number(args[1]) > data[message.guild.id]['users'][message.author.id]['credits']) {
            return message.channel.send("\:moneybag: You don't have enough credits, <@" + message.author.id + ">!");
        }

        let sumSeconds = 0;
        nums.forEach((number,i) => {
            if(i == 0) sumSeconds += Number(number) * 3600;
            if(i == 1) sumSeconds += Number(number) * 60;
            if(i == 2) sumSeconds += Number(number);
        });

        //Choose winner:
        data[guild]['users'][auth]['credits'] -= parseFloat(args[1]);
        fs.writeFileSync('./data.json', JSON.stringify(data));
        const filter = reaction => { return ['💎'].includes(reaction.emoji.name); }
        let embed = new Discord.MessageEmbed();
        embed.setTitle(message.author.username + " started a raffle!");
        embed.setThumbnail(message.author.avatarURL);
        embed.setColor('#ff0000');
        embed.addField('Prize:', args.slice(1).join(" ")+"\n React with a 💎 to enter the raffle");

        message.channel.send(embed).then( message => {
            message.react("💎");
            console.log(sumSeconds);
            message.awaitReactions(filter,{max:50,time:sumSeconds*1000}).then(collection => {
                //There is probably a much better way to do this, will look into it later
                let keyVals = [];
                for(const [key, value] of collection.first().users.entries()){
                    if(key == creator.id || key == client.user.id) continue;
                    keyVals.push(key);
                }

                if(keyVals.length < 1){
                    data[guild]['users'][auth]['credits'] += parseFloat(args[1]);
                    fs.writeFileSync('./data.json', JSON.stringify(data));
                    return message.channel.send("Nobody joined the raffle in time")
                };

                let winner = keyVals[Math.floor(Math.random() * (keyVals.length))];
                client.fetchUser(winner).then(nm => {
                    console.log(keyVals);
                    message.channel.send("💎 Hey "+ creator + ", "+nm+" won your raffle").then(msg => {
                        console.log(creditGiveaway);
                        if(!creditGiveaway) return;
                        data[guild]['users'][nm.id]['credits'] += parseFloat(args[1]);
                        return fs.writeFileSync('./data.json', JSON.stringify(data));
                    }).catch();
                }).catch();
            }).catch();
        }).catch();
        */
    }
};
