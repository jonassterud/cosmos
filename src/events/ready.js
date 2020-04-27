module.exports = async (client) => {
    // Create data:
    if (!fs.existsSync('./data.json')) fs.writeFileSync('./data.json', '{}');
    let data = JSON.parse(fs.readFileSync('./data.json'));
    client.guilds.tap(guild => {
        if (!data.hasOwnProperty(guild.id)) data[guild.id] = {};
        if (!data[guild.id].hasOwnProperty('users')) data[guild.id]['users'] = {};
        guild.members.tap(member => {
            if (!data[guild.id]['users'].hasOwnProperty(member.id)) data[guild.id]['users'][member.id] = {};
            if (!data[guild.id]['users'][member.id].hasOwnProperty('credits')) data[guild.id]['users'][member.id]['credits'] = 5000;
        });
    });

    // Write data:
    fs.writeFileSync('./data.json', JSON.stringify(data));

    // Other:
    client.logger.ready("Online!");
    client.user.setActivity(secret.prefix + "help", {type: "LISTENING"}); // Example: Listening to ?help
}