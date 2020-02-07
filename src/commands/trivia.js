const request = require('request');

//Helper function
function shuffle(array) {
  let currentIndex = array.length,
    tempVal, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    tempVal = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempVal;

  }
  return array;
}

module.exports = {
  name: 'trivia',
  description: 'Answer trivia for a chance to win credits!',
  args: false,
  usage: '',
  execute(message) {
    request({
      url: "https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple",
      json: true
    }, function(e, r, body) {
      if (e) return message.channel.send("\:no_entry: Wasn't able to retrieve any questions, <@" + message.author.id + ">!");
      if (!body.results.length) return message.channel.send("\:no_entry: No questions were found, <@" + message.author.id + ">!");

      let emos = ["🍉", "🍇", "🍍", "🥥"];
      let emoAns;

      let answers = [];
      answers.push(body.results[0].correct_answer);
      body.results[0].incorrect_answers.forEach(ans => answers.push(ans));
      let optionString = "";
      answers = shuffle(answers);
      answers.forEach((ans, i) => {
        optionString += (ans + " " + emos[i] + " \n");
        if (ans == body.results[0].correct_answer) emoAns = emos[i];
      });

      let embed = new Discord.RichEmbed();
      embed.setTitle("Trivia! Respond by reacting to the correct answer");
      embed.setThumbnail(message.author.avatarURL);
      embed.setColor('#ff0000');
      embed.addField('Category:', " " + body.results[0].category);
      embed.addField('Question:', " " + body.results[0].question);
      embed.addField('Options:', " " + optionString);
      embed.setTimestamp(new Date());

      console.log(optionString);

      message.channel.send(embed).then(msg => {
        msg.react(emos[0]).then(mes => {
          msg.react(emos[1]).then(mes => {
            msg.react(emos[2]).then(mes => {
              msg.react(emos[3]).then(mes => {
                msg.awaitReactions((reaction, user) => user.id == message.author.id && emos.includes(reaction.emoji.name), {
                  max: 1,
                  time: 60000
                }).then(collected => {
                  if (collected.first().emoji.name == emoAns) {
                    message.reply("correct answer");
                  } else {
                    message.reply("wrong answer");
                  }
                }).catch(() => message.reply("No reaction, trivia cancelled"));
              }).catch();
            }).catch();
          }).catch();
        }).catch();
      }).catch();
    });
    return;
  }
};