// Packages:
const readdirSync = require('fs').readdirSync;

// Load modules into client:
exports.registerModules = async client => {
    const moduleFiles = readdirSync('./modules/');
    moduleFiles.forEach(file => {
        const moduleName = file.split('.')[0];
        if(moduleName[0] === moduleName[0].toLowerCase() || moduleName === 'Loader') return;
        client[moduleName.toLowerCase()] = require('./' + moduleName);
    });
};

// Load commands into client:
exports.registerCommands = async client => {
    const cmdFolders = readdirSync('./commands/');
    let registeredCommands = [];
    cmdFolders.forEach(folder => {
        const cmdFiles = readdirSync('./commands/' + folder);
        client.logger.log(`Loading ${cmdFiles.length} commands`); // Too much?
        cmdFiles.forEach(file => {
            const commandName = file.split('.')[0];
            const props = require(`../commands/${folder}/${file}`);
            client.commands.set(props.name, props);
            registeredCommands.push(commandName);
        });
    });
    client.logger.log(`Loaded: [${registeredCommands.join(' ')}]`);

};

// Load events into client:
exports.registerEvents = async client => {
    const eventFiles = readdirSync('./events/');
    client.logger.log(`Loading ${eventFiles.length} events`);

    const registeredEvents = [];
    eventFiles.forEach(file => {
        const eventName = file.split('.')[0];
        const evt = require(`../events/${file}`);
        client.on(eventName, evt.bind(null, client));
        registeredEvents.push(eventName);
    });
    client.logger.log(`Loaded: [${registeredEvents.join(' ')}]`);
};

// Log Discord status:
exports.checkDiscordStatus = client => {
    require('axios').get('https://srhpyqt94yxb.statuspage.io/api/v2/status.json').then(({ data }) => {
        client.logger.log(`Discord API Status: ${data.status.description}`);
    });
};
