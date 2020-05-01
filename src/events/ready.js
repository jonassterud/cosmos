module.exports = async client => {
    // Replace this with a createprofile-like command for each user:
    /*
    if(!fs.existsSync('./data.json')) fs.writeFileSync('./data.json', '{}');
    const data = JSON.parse(fs.readFileSync('./data.json'));
    client.guilds.cache.tap(guild => {
        if (!data.hasOwnProperty(guild.id)) data[guild.id] = {};
        if (!data[guild.id].hasOwnProperty('users')) data[guild.id]['users'] = {};
        guild.members.cache.tap(member => {
            if(!data[guild.id]['users'].hasOwnProperty(member.id)) data[guild.id]['users'][member.id] = {};
            if(!data[guild.id]['users'][member.id].hasOwnProperty('credits')) data[guild.id]['users'][member.id]['credits'] = 5000;
        });
    });
    fs.writeFileSync('./data.json', JSON.stringify(data));
    */

    client.logger.ready('Online!');
    client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'});
};
