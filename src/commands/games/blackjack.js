module.exports = {
    name: 'blackjack',
    description: '\:slot_machine: Play blackjack!',
    args: true,
    usage: '<credit amount>',
    async execute(message, args) {
        // Variable(s):
        const creditAmount = parseInt(args[0]);

        // Guard(s):
        if(!Object.prototype.hasOwnProperty.call(accounts, message.author.id)) return message.channel.send(`\:no_entry: Create an account first with \`${config.prefix}account\`, <@${message.author.id}>!`);
        if(isNaN(creditAmount)) return message.channel.send(`\:question: You need to specify the amount of credits you want to bet, <@${message.author.id}>!`);
        if(creditAmount > accounts[message.author.id].balance) return message.channel.send(`\:moneybag: Insufficient funds, <@${message.author.id}>!`);

        // Start game:
        const emotes = {stand: '🧍‍♂️', hit: '🏏'};
        const deck = new decks.StandardDeck();
        deck.shuffleAll();
        accounts[message.author.id].balance -= creditAmount;

        // Draw cards:
        const dealer = deck.draw(2);
        const player = deck.draw(2);

        // Create embed:
        const embed = new Discord.MessageEmbed()
            .setTitle('\:slot_machine: Blackjack!')
            .setDescription(
                `The pot is on ${creditAmount} credits.\n` +
                `React with ${emotes.stand} to stand or ${emotes.hit} to hit!`
            )
            .addField('Dealer:', `${dealer[0].rank.longName} of ${dealer[0].suit.name}\n*hidden*`)
            .addField('Player:', `${player[0].rank.longName} of ${player[0].suit.name}\n${player[1].rank.longName} of ${player[1].suit.name}`)
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Send embed and react with emotes:
        const sentMessage = await message.channel.send(embed);
        for(const emoteProperty in emotes) await sentMessage.react(emotes[emoteProperty]);

        // Create collector:
        const filter = (reaction, user) => user.id == message.author.id && Object.values(emotes).includes(reaction.emoji.name);
        const collector = sentMessage.createReactionCollector(filter, {time: 1000 * 60});

        // On reaction:
        collector.on('collect', reaction => {
            // Stand:
            if(reaction.emoji.name == emotes.stand) {
                // Draw card(s) and update embed:
                while(calculatePoints(dealer) < 17) dealer.push(...deck.draw(1));
                endRound();

                // Compare and check points:
                const playerPoints = calculatePoints(player);
                const dealerPoints = calculatePoints(dealer);

                // Respond based on all possible winning combinatins:
                if(playerPoints === dealerPoints) {
                    accounts[message.author.id].balance += creditAmount;
                    return message.channel.send(`\:monkey: Push! You and the dealer got the same amount of points, <@${message.author.id}>!`);
                } else if(playerPoints > 21) {
                    return message.channel.send(`\:x: Busted! You got more than 21 points, <@${message.author.id}>!`);
                } else if(playerPoints === 21) {
                    accounts[message.author.id].balance += creditAmount * 2.5;
                    return message.channel.send(`\:moneybag: Blackjack! You won ${creditAmount * 1.5} credits, <@${message.author.id}>!`);
                } else if(dealerPoints > 21) {
                    return message.channel.send(`\:moneybag: The dealer busted, and you won ${creditAmount} credits, <@${message.author.id}>!`);
                } else if(dealerPoints > playerPoints) {
                    return message.channel.send(`\:x: The dealer got more points than you and you lost, <@${message.author.id}>!`);
                } else if(playerPoints > dealerPoints) {
                    accounts[message.author.id].balance += creditAmount * 2;
                    return message.channel.send(`\:moneybag: You got more points than the dealer and won ${creditAmount} credits, <@${message.author.id}>!`);
                } else {
                    accounts[message.author.id].balance += creditAmount;
                    message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
                    return client.logger.error('Unknown combination in Blackjack.');
                }
            // Hit:
            } else if(reaction.emoji.name == emotes.hit) {
                // Draw card:
                player.push(...deck.draw(1));

                // Update embed:
                embed.fields[1].value = '';
                for(const card of player) embed.fields[1].value += `${card.rank.longName} of ${card.suit.name}\n`;
                sentMessage.edit(embed);
                reaction.users.remove(message.author.id);

                // Check points:
                const playerPoints = calculatePoints(player);
                if(playerPoints > 21) {
                    endRound();
                    return message.channel.send(`\:x: Busted! You got more than 21 points, <@${message.author.id}>!`);
                }
            }
        });

        // Functions:
        function calculatePoints(hand) {
            let sum = 0;
            for(const card of hand) {
                if(card.rank.shortName === 'A') sum += 11;
                else if(isNaN(card.rank.shortName)) sum += 10;
                else sum += parseInt(card.rank.shortName);
            }
            if(sum > 21 && hand.find(e => e.rank.shortName === 'A')) sum -= 10;
            return sum;
        }

        function endRound() {
            // Stop collector and remove reactions:
            collector.stop();
            sentMessage.reactions.removeAll();

            // Show dealer's hand:
            embed.fields[0].value = '';
            for(const card of dealer) embed.fields[0].value += `${card.rank.longName} of ${card.suit.name}\n`;
            sentMessage.edit(embed);
        }
    }
};
