// Randomize questions function
function shuffle (array) {
    let currentIndex = array.length; let tempVal; let randomIndex;
    while(currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempVal = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempVal;
    }
    return array;
}

// Command
module.exports = {
    name: 'trivia',
    description: '\:thinking: Answer trivia for a chance to win credits!',
    args: false,
    usage: '',
    execute (message) {
        request({
            url: 'https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple',
            json: true
        }, (e, r, body) => {
            // Check for errors:
            if(e) return message.channel.send("\:no_entry: Wasn't able to retrieve any questions, <@" + message.author.id + '>!');
            if(!body.results.length) return message.channel.send('\:no_entry: No questions were found, <@' + message.author.id + '>!');

            // Variables:
            const aps = /&#039;/g;
            const quot = /&quot;/g;
            const emos = ['🍉', '🍇', '🍍', '🥥'];
            let emoAns;
            let answers = [];
            let optionString = '';

            // Get answers:
            answers.push(body.results[0].correct_answer);
            body.results[0].incorrect_answers.forEach(ans => answers.push(ans));

            // Randomize questions:
            answers = shuffle(answers);
            answers.forEach((ans, i) => {
                optionString += (ans + ' ' + emos[i] + ' \n');
                if(ans == body.results[0].correct_answer) emoAns = emos[i];
            });

            // Create embed:
            const embed = new Discord.MessageEmbed()
                .setTitle('Trivia! Respond by reacting to the correct answer')
                .setThumbnail(message.author.avatarURL)
                .setColor('#ff0000')
                .addField('Category:', ' ' + body.results[0].category.replace(aps, "'").replace(quot, '"'))
                .addField('Question:', ' ' + body.results[0].question.replace(aps, "'").replace(quot, '"'))
                .addField('Options:', ' ' + optionString.replace(aps, "'").replace(quot, '"'))
                .setTimestamp(new Date());

            // Send embed with reactions:
            message.channel.send(embed).then(msg => {
                msg.react(emos[0]).then(() => {
                    msg.react(emos[1]).then(() => {
                        msg.react(emos[2]).then(() => {
                            msg.react(emos[3]).then(() => {
                                msg.awaitReactions((reaction, user) => user.id == message.author.id && emos.includes(reaction.emoji.name), {
                                    max: 1,
                                    time: 60000
                                }).then(collected => {
                                    if(collected.first().emoji.name == emoAns) {
                                        message.channel.send('\:ballot_box_with_check: Correct answer, <@' + message.author.id + '>!');
                                    } else {
                                        message.channel.send('\:regional_indicator_x: Wrong answer, <@' + message.author.id + '>!');
                                    }
                                }).catch(() => message.channel.send('\:no_entry: No reaction was found, trivia cancelled!'));
                            }).catch();
                        }).catch();
                    }).catch();
                }).catch();
            }).catch();
        });
    }
};
