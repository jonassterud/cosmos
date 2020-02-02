const fs = require('fs');
module.exports = {
  name: 'raffle',
    description: '\:moneybag: Create giveaways!',
    args: true,
    usage: '<user>',
  execute(message,args){
    const re = /^(\d\d:\d\d:\d\d)$/;
    if(!re.test(args[0]) || args.length <= 1) return message.channel.send("Wrong usage, do 00:00:00 with hours, minutes, seconds then what you want to raffle");
    const nums = args[0].split(":");
    const creator = message.author;
    let creditGiveaway = false;
    const decideType = /^(\d)+(credit)s*$/
    let data = JSON.parse(fs.readFileSync('./data.json'));
    creditGiveaway = decideType.test(args.slice(1));
    if(creditGiveaway && Number(args[1]) > data[message.guild.id]['users'][message.author.id]['credits']){
      return message.channel.send("\:moneybag: You don't have enough credits, <@" + message.author.id + ">!");
    }
    let sumSeconds = 0;
    nums.forEach((number,i) => {
      if(i == 0){
        sumSeconds += Number(number)*3600;
      }
      if(i == 1){
        sumSeconds += Number(number)*60;
      }
      if(i == 2){
        sumSeconds += Number(number);
      }
    });
    //Choose winner
    const price = args.slice(1).join(" ");
    const filter = reaction => {
      return ['💎'].includes(reaction.emoji.name);
    }

    let embed = new Discord.RichEmbed();
      embed.setTitle(message.author.username + " started a raffle!");
      embed.setThumbnail(message.author.avatarURL);
      embed.setColor('#ff0000');
      embed.addField('Prize:', args.slice(1)+"\n React with a 💎 to enter the raffle");

    message.channel.send(embed).then( message => {
      message.react("💎");
      console.log(sumSeconds);
      message.awaitReactions(filter,{max:50,time:sumSeconds*1000}).then(collection => {
        //There is probably a much better way to do this, will look into it later
        let keyVals = [];
        for(const [key,value] of collection.first().users.entries()){
          if(key == creator.id) continue;
          keyVals.push(key);
        }
        keyVals.shift();
        if(keyVals.length < 1) return message.channel.send("Nobody joined the raffle in time");
        let winner = keyVals[Math.floor(Math.random() * (keyVals.length+1))];
        client.fetchUser(winner).then(nm => {
          console.log(keyVals);
          message.channel.send("💎 Hey "+ creator + ", "+nm+" won your raffle").then(msg => {
            if(!creditGiveaway) return;
            data[message.guild.id]['users'][nm]['credits'] += args[1];
            data[message.guild.id]['users'][message.author.id]['credits'] -= args[1];
            return fs.writeFileSync('./data.json', JSON.stringify(data));
          }).catch();
        }).catch();
      }).catch();
    }).catch();

  },
};
