module.exports = {
    name: 'account',
    description: '\:shield: Check your balance, someones else\'s balance or create an account!',
    args: false,
    usage: '(user?)',
    async execute(message) {
        // Variable(s):
        const user = message.mentions.users.first() || message.author;
        const member = message.mentions.members.first() || message.member;
        let newAccount = false;

        // Create account if account doesn't exist:
        if(user.id === message.author.id && !accounts?.[user.id]) {
            newAccount = true;
            accounts[user.id] = {
                balance: config.starting_balance
            };
        }

        // Create embed:
        const roles = member.roles.cache.array().map(e => e.name).filter(e => e !== '@everyone');
        const balance = `${accounts?.[user.id]?.balance || 0} credits`;
        const embed = new Discord.MessageEmbed()
            .setTitle(`\:shield: Account${newAccount ? ' created!' : ':'}`)
            .setThumbnail(user.displayAvatarURL())
            .addField('Tag:', user.tag)
            .addField('Balance:', balance)
            .addField('Roles:', roles.join(', '))
            .addField('Identification:', `\`${user.id}\``)
            .addField('Account created:', user.createdAt.toDateString())
            .setColor('#ff0000')
            .setTimestamp(new Date());

        // Send embed:
        return message.channel.send(embed);
    }
};
