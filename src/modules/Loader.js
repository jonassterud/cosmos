// Packages:
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

// Load modules into client:
exports.registerModules = async client => {
    const moduleFiles = await readdir('./modules/');
    moduleFiles.forEach(file => {
        const moduleName = file.split('.')[0];
        if(moduleName[0] === moduleName[0].toLowerCase() || moduleName === 'Loader') return;
        client[moduleName.toLowerCase()] = require('./' + moduleName);
    });
};

// Load commands into client:
exports.registerCommands = async client => {
    const cmdFiles = await readdir('./commands/');
    client.logger.log(`Loading ${cmdFiles.length} commands`);
    const registeredCommands = [];
    cmdFiles.forEach(file => {
        const commandName = file.split('.')[0];
        const props = require(`../commands/${file}`);
        client.commands.set(props.name, props);
        registeredCommands.push(commandName);
    });
    client.logger.log(`Loaded: [${registeredCommands.join(' ')}]`);
};

// Load events into client:
exports.registerEvents = async client => {
    const eventFiles = await readdir('./events/');
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
