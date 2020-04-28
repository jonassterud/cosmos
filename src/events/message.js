module.exports = async (client, message) => {
    if(message.author.bot) return;
    const data = JSON.parse(fs.readFileSync('./data.json'));
    data[message.guild.id].users[message.author.id].credits++;
    fs.writeFileSync('./data.json', JSON.stringify(data));

    // Split command and arguments:
    if(!message.content.startsWith(secret.prefix) || message.author.bot) return;
    const args = message.content.slice(secret.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(!client.commands.has(commandName)) return;

    // Retrieve command:
    const command = client.commands.get(commandName);
    if(command.args && !args.length) {
        let reply = 'Missing arguments!';
        if(command.usage) reply += '\nFormat: `' + secret.prefix + command.name + ' ' + command.usage + '`';
        message.channel.send(reply);
    }

    // Execute command:
    try {
        command.execute(message, args);
    } catch (e) {
        console.error('Command execution error:\n' + e);
    }
};
