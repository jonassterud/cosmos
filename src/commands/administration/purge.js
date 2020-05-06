// Command
module.exports = {
    name: 'purge',
    description: '\:boom: Delete messages!',
    args: true,
    usage: '<amount>',
    async execute(message, args) {
        // Guard:
        if(!/^100$|^[1-9][0-9]$|^[0-9]$/m.test(args[0])) return message.channel.send(`\:question: Invalid amount. Make sure the amount is in the range from 1 to 100, <@${message.author.id}>!`);

        // Purge:
        await message.channel.bulkDelete(parseInt(args[0])+1);
        message.channel.send(`\:boom: Deleted ${parseInt(args[0])} message${(parseInt(args[0]) > 1) ? 's' : ''}, <@${message.author.id}>!`).then((msg) => {
            msg.delete({timeout:5000,reason:""});
        }).catch((err) => {
            console.error(err);
        });
        return;
    }
};
