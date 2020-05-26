// Package(s):
const fs = require('fs');

// Load modules into client:
exports.registerModules = async client => {
    const moduleFiles = fs.readdirSync('./modules/');
    moduleFiles.forEach(file => {
        const moduleName = file.split('.')[0];
        if(moduleName[0] === moduleName[0].toLowerCase() || moduleName === 'Loader') return;
        client[moduleName.toLowerCase()] = require(`./${moduleName}`);
    });
};

// Load commands into client:
exports.registerCommands = async client => {
    const registeredCommands = [];
    const dirs = fs.readdirSync('./commands/').filter(file => fs.statSync(`./commands/${file}`).isDirectory());

    // Loop trough directories:
    for(const dir of dirs) {
        client.logger.log(`Loading ${dir} commands`);
        const files = fs.readdirSync(`./commands/${dir}`);
        for(const file of files) {
            // Add subfolders:
            if(fs.statSync(`./commands/${dir}/${file}`).isDirectory()) {
                dirs.push(`${dir}/${file}`);
                continue;
            }

            // Add command to client:
            const name = file.split('.')[0];
            const properties = require(`../commands/${dir}/${file}`);
            client.commands.set(properties.name, properties);
            registeredCommands.push(name);
        }
    }
    client.logger.log(`Loaded: [${registeredCommands.join(' ')}]`);
};

// Load events into client:
exports.registerEvents = async client => {
    const eventFiles = fs.readdirSync('./events/');
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
exports.checkDiscordStatus = async client => {
    require('axios').get('https://srhpyqt94yxb.statuspage.io/api/v2/status.json').then(({data}) => {
        client.logger.log(`Discord API Status: ${data.status.description}`);
    });
};
