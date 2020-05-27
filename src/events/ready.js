module.exports = async client => {
    client.logger.ready(`Online in ${client.guilds.cache.size} server${client.guilds.cache.size > 1 ? 's' : ''}`);
    client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'});
};
