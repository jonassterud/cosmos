module.exports = async (client, message) => {
    // Add credits to author:
    if(Object.prototype.hasOwnProperty.call(accounts, message.author.id)) {
        accounts[message.author.id].balance += config.message_reward;
    }

    // Split command and argument(s) + Guard(s):
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(!client.commands.has(commandName)) return;

    // Retrieve command:
    const command = client.commands.get(commandName);
    if(command.args && !args.length) {
        let reply = 'Missing arguments!';
        if(command.usage) reply += `\nFormat: \`${config.prefix + command.name} ${command.usage}\``;
        return message.channel.send(reply);
    }

    // Execute command:
    try {
        return command.execute(message, args);
    } catch(error) {
        return client.logger.error(error);
    }
};
