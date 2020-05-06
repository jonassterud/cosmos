module.exports = async client => {
    client.logger.ready('Online!');
    client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'});
};
