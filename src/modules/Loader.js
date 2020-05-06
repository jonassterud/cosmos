// Packages:
const readdirSync = require('fs').readdirSync;

// Load modules into client:
exports.registerModules = async client => {
    const moduleFiles = readdirSync('./modules/');
    moduleFiles.forEach(file => {
        const moduleName = file.split('.')[0];
        if(moduleName[0] === moduleName[0].toLowerCase() || moduleName === 'Loader') return;
        client[moduleName.toLowerCase()] = require(`./${moduleName}`);
    });
};

// Load commands into client:
exports.registerCommands = async client => {
    const { readdirSync, statSync } = require('fs');
    const { join } = require('path');
    let registeredCommands = [];
    const getDirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());
    let dirs = getDirs('./commands/');
    for(let i = 0; i < dirs.length; i++) {
        let dir = dirs[i];
        client.logger.log(`Loading ${dir} commands`);
        const files = readdirSync(`./commands/${dir}`);
        for(let j = 0; j < files.length; j++) {
            const file = files[j];
            if(statSync(`./commands/${dir}/${file}`).isDirectory()) {
                dirs.push(`${dir}/${file}`);
                continue;
            }
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
exports.checkDiscordStatus = async client => {
    require('axios').get('https://srhpyqt94yxb.statuspage.io/api/v2/status.json').then(({data}) => {
        client.logger.log(`Discord API Status: ${data.status.description}`);
    });
};
