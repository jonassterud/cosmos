// Get libraries
const secret = require('./config.json'); // Secret data
const fs = require('fs'); // Node.js package - file system
global.Discord = require('discord.js'); // Node.js package - Discord API

// Create bot
global.client = new Discord.Client();

// Create commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(f => {
    const command = require(`./commands/${f}`);
    client.commands.set(command.name, command);
});

// Ready event
client.once('ready', () => {    
    // Create data:
    if(!fs.existsSync('./data.json')) fs.writeFileSync('./data.json', '{}');
    let data = JSON.parse(fs.readFileSync('./data.json'));
    client.guilds.tap(guild => {
        if(!data.hasOwnProperty(guild.id)) data[guild.id] = {};
        if(!data[guild.id].hasOwnProperty('users')) data[guild.id]['users'] = {};
        guild.members.tap(member => {
            if(!data[guild.id]['users'].hasOwnProperty(member.id)) data[guild.id]['users'][member.id] = {};
            if(!data[guild.id]['users'][member.id].hasOwnProperty('credits')) data[guild.id]['users'][member.id]['credits'] = 5000;
            if(!data[guild.id]['users'][member.id].hasOwnProperty('coinflip')) data[guild.id]['users'][member.id]['coinflip'] = {};
            if(!data[guild.id]['users'][member.id]['coinflip'].hasOwnProperty('amount')) data[guild.id]['users'][member.id]['coinflip']['amount'] = 0;
            if(!data[guild.id]['users'][member.id]['coinflip'].hasOwnProperty('opponent')) data[guild.id]['users'][member.id]['coinflip']['opponent'] = '';
        });
    });

    // Write data:
    fs.writeFileSync('./data.json', JSON.stringify(data));

    // Other:
    console.log("Online!");
    client.user.setActivity(secret.prefix + "help", {type: "LISTENING"});
});

// Message event
client.on('message', message => {
    // Add to balance
    let data = JSON.parse(fs.readFileSync('./data.json'));
    data[message.guild.id]['users'][message.author.id]['credits']++;
    fs.writeFileSync('./data.json', JSON.stringify(data));

    // Split command and arguments:
    if(!message.content.startsWith(secret.prefix) || message.author.bot) return;
    const args = message.content.slice(secret.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(!client.commands.has(commandName)) return;
    
    // Retrieve command:
    const command = client.commands.get(commandName);
    if(command.args && !args.length) {
        let reply = "Missing arguments!";
        if(command.usage) reply += "\nFormat: `" + secret.prefix + command.name + " " + command.usage + "`";
        message.channel.send(reply);
    }
    
    // Execute command:
    try {
        command.execute(message, args);
    } catch(e) {
        console.error("Command execution error:\n" + e);
    }
});

// Bot login
try {
    client.login(secret.token);
} catch(e) {
    console.error("Bot login error:\n" + e);
}

// Functions and variables
global.readData = (...layers) => {
    let data = JSON.parse(fs.readFileSync('./data.json'));
    layers.forEach(layer => data = data[layer]);
    return data;
}

global.writeData = (finalValue, ...layers) => {
    // Create regex:
    let string = "(.*?";
    layers.forEach(layer => string += layer + ".*?");
    const regex = new RegExp(string + ")([\\w\\d]+|{.*?}|\"\"|'')(.*)");

    // Use regex on data:
    let dataString = JSON.stringify(JSON.parse(fs.readFileSync('./data.json')));
    let groups = regex.exec(dataString);

    // Write data:
    fs.writeFileSync('./data.json', groups[1] + finalValue + groups[3]);
}

// Regexes
global.validNumber = /^-*\d+$/;
global.validWord = /\w*$/;
global.validUser = /^<@!\d+>$/;