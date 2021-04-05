// Randomize questions function
function shuffle(array) {
    let currentIndex = array.length;
    let tempVal;
    let randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        tempVal = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempVal;
    }
    return array;
}

//Unsanitize input
function unSanitize(string) {
    string = string.replace(/&#(\d+);/g, (c, m) => {
        return String.fromCharCode(m);
    });
    //Not all characters follow this pattern ):
    string = string.replace(/&quot;/g, '"');
    return string.replace(/&ndash;/g, '-');
}
//Let's get all the categories
let triviaCategories;
https.get('https://opentdb.com/api_category.php', (res) => {
    let str = '';
    res.on('data', (chunk) => {
        str += chunk;
    });
    res.on('end', () => {
        triviaCategories = JSON.parse(str);
    });
});
// Command
module.exports = {
    name: 'trivia',
    description: ':thinking: Answer trivia for a chance to win credits!',
    args: false,
    usage: '[optional category]',
    async execute(message, args) {
        let cat = '';
        if (args != undefined && args.length != 0) {
            triviaCategories?.trivia_categories?.find((obj) => {
                if (obj.name.toLowerCase().split(' ').includes(args[0].toLowerCase())) {
                    cat = obj.id;
                    return true;
                }
                return false;
            });
            cat != '' ? (cat = '&category=' + cat) : (cat = '');
        }
        https.get('https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple' + cat, (response) => {
            // Guards:
            let str = '';
            response.on('data', (chunk) => {
                str += chunk;
            });
            response.on('end', () => {
                let body;
                try {
                    body = JSON.parse(str);
                } catch (error) {
                    //This is just in case the API is down or something wonky happens with the request
                    client.logger.error(error);
                    return;
                }
                if (!body) return message.channel.send(`\:no_entry: Wasn't able to retrieve any questions, <@${message.author.id}>!`);
                // Variables:
                const emos = ['🍉', '🍇', '🍍', '🥥'];
                let emoAns;
                let answers = [];
                let optionString = '';

                // Get answers:
                answers.push(body.results[0].correct_answer);
                body.results[0].incorrect_answers.forEach((ans) => answers.push(ans));

                // Randomize questions:
                answers = shuffle(answers);
                answers.forEach((ans, i) => {
                    optionString += `${ans} ${emos[i]}\n`;
                    if (ans == body.results[0].correct_answer) emoAns = emos[i];
                });

                // Create embed:
                const embed = new Discord.MessageEmbed()
                    .setTitle('Trivia! Respond by reacting to the correct answer')
                    .setThumbnail(message.author.avatarURL)
                    .setColor('#ff0000')
                    .addField('Category:', ` ${unSanitize(body.results[0].category)}`)
                    .addField('Question:', ` ${unSanitize(body.results[0].question)}`)
                    .addField('Options:', ` ${unSanitize(optionString)}`)
                    .setTimestamp(new Date());

                // Start trivia:
                (async function () {
                    try {
                        const sentMessage = await message.channel.send(embed);
                        for (const emo of emos) await sentMessage.react(emo);
                        const filter = (reaction, user) => user.id === message.author.id && emos.includes(reaction.emoji.name);
                        const collector = sentMessage.createReactionCollector(filter, {
                            max: 1,
                            time: 60000,
                        });
                        let someoneReacted = false;

                        collector.on('collect', (reaction) => {
                            someoneReacted = true;
                            if (reaction.emoji.name === emoAns)
                                return message.channel.send(`\:ballot_box_with_check: Correct answer, <@${message.author.id}>!`);
                            else
                                return message.channel.send(
                                    `\:regional_indicator_x: Wrong answer, <@${message.author.id}>! The correct answer was: ${body.results[0].correct_answer}`
                                );
                        });

                        collector.on('end', () => {
                            if (!someoneReacted) return message.channel.send(':no_entry: No reaction was found, trivia cancelled');
                        });
                    } catch (error) {
                        client.logger.error(error);
                        return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
                    }
                })();
            });
        });
    },
};
