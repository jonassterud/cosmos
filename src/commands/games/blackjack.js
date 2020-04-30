// Shuffle deck function
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

// Get a card string from a given number function
function getCard (num) {
    const types = ['spades', 'clubs', 'hearts', 'diamonds'];
    const faces = ['Ace', 'Jack', 'Queen', 'King'];
    const type = types[Math.trunc((num / 13) - 0.0001)];
    let value = 0;

    while(num > 13) num -= 13;
    switch(num) {
        case 1: value = faces[0]; break;
        case 11: value = faces[1]; break;
        case 12: value = faces[2]; break;
        case 13: value = faces[3]; break;
        default: value = num; break;
    }

    return value + ' of ' + type;
}

// TODO: Aces can be 11 or 1, something like that. Right now, it is only 1
// Given an array of cards, return the sum of the values function
function getJackSum (arr) {
    if(!arr.length) return 0;
    return arr.reduce((acc, val) => {
        let b = val;
        while(b > 13) b -= 13;
        return acc + (b > 10 ? 10 : b);
    }, 0);
}

// Create embed function
function createEmbed (pl1Cards, pl2Cards, userUrl) {
    const pl1string = getCard(pl1Cards[0]) + ' \n *hidden*';
    let pl2string = '';
    pl2Cards.forEach(card => pl2string += getCard(card) + '\n');
    const embed = new Discord.MessageEmbed()
        .setTitle('BlackJack! React with 🏏 to hit, 🧍‍♂️ to stand.')
        .setThumbnail(userUrl)
        .setColor('#ff0000')
        .addField('Dealer:', pl1string)
        .addField('Player:', pl2string);
    return embed;
}

// Command
module.exports = {
    name: 'blackjack',
    description: '\:slot_machine: Play blackjack against the bot!',
    args: true,
    usage: '<credit amount>',
    execute(message, args) {
        // Guard:
        if(!/^[\d]+$/.test(args[0])) return message.channel.send('\:no_entry: Invalid input, <@' + message.author.id + '>!');

        // Variables:
        const bet = args[0];
        const emos = ['🏏', '🧍‍♂️'];
        const deck = new Array(52).fill(0).map((curr, ind) => curr = ind + 1);
        const data = JSON.parse(fs.readFileSync('./data.json'));
        const playerCards = []; const dealerCards = [];

        // Check if user has appropriate credit count:
        if(data[message.guild.id].users[message.author.id].credits < bet) {
            return message.channel.send('\:question: You do not have enough credits to make this bet, <@' + message.author.id + '>!');
        }

        // Deduct credits:
        data[message.guild.id].users[message.author.id].credits -= bet;
        fs.writeFileSync('./data.json', JSON.stringify(data));

        // Setup message:
        shuffle(deck);
        playerCards.push(deck.pop());
        playerCards.push(deck.pop());

        while(getJackSum(dealerCards) < 17) dealerCards.push(deck.pop());

        const embed = createEmbed(dealerCards, playerCards, message.author.avatarUrl);
        message.channel.send(embed).then(msg => {
            handleGame(msg);
        }).catch();

        function handleGame (mess) {
            mess.react(emos[0]).then(() => {
                mess.react(emos[1]).then(() => {
                    mess.awaitReactions((reaction, user) => user.id == message.author.id && emos.includes(reaction.emoji.name), {
                        max: 1,
                        time: 30000
                    }).then(coll => {
                        // emos[0] corresponds to a 'hit':
                        if(coll.first().emoji.name == emos[0]) {
                            playerCards.push(deck.pop());
                            mess.edit(createEmbed(dealerCards, playerCards, message.author.avatarUrl));
                            if(getJackSum(playerCards) == 21) {
                                noWinner = false;
                                data[message.guild.id].users[message.author.id].credits += 2 * bet;
                                fs.writeFileSync('./data.json', JSON.stringify(data));
                                return message.channel.send('\:moneybag: BlackJack! You got 21 points, <@' + message.author.id + '>');
                            } else if(getJackSum(playerCards) > 21) {
                                noWinner = false;
                                console.log(playerCards);
                                console.log(getJackSum(playerCards));
                                return message.channel.send('\:x: Busted! You got more than 21 points, <@' + message.author.id + '>');
                            } else {
                                mess.clearReactions().then(() => {
                                    handleGame(mess);
                                }).catch();
                            }
                        } else {
                            // Stand:
                            noWinner = false;
                            if(getJackSum(dealerCards) <= 21 && getJackSum(dealerCards) > getJackSum(playerCards)) {
                                // Dealer won:
                                message.channel.send('\:x: Busted! The dealer had more points than you, <@' + message.author.id + '>');
                            } else if(getJackSum(dealerCards) <= 21 && getJackSum(dealerCards) == getJackSum(playerCards)) {
                                // Draw:
                                data[message.guild.id].users[message.author.id].credits += bet;
                                message.channel.send('\:monkey: Draw! The dealer had the same amount of points as you, <@' + message.author.id + '>');
                            } else {
                                // Dealer lost:
                                data[message.guild.id].users[message.author.id].credits += 2 * bet;
                                message.channel.send('\:moneybag: Winner! You had more points than the dealer, <@' + message.author.id + '>');
                            }
                            return fs.writeFileSync('./data.json', JSON.stringify(data));
                        }
                    }).catch(() => {
                        noWinner = false;
                        return message.channel.send("\:no_entry: Didn't join in time, <@" + message.author.id + '>');
                    });
                }).catch();
            }).catch();
        }
    }
};
