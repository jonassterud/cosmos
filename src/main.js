// Get libraries
const fs = require('fs'); // Node.js package - file system
const Discord = require('discord.js'); // Node.js package - Discord API
const secret = require('./config.json'); // Secret data

// Create bot
const client = new Discord.Client();

// Create commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(f => {
    const command = require(`./commands/${f}`);
    client.commands.set(command.name, command);
});

// Ready event
client.once('ready', () => {
    console.log("Online!");
    // Build data here..
});

// Message event
client.on('message', message => {
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
        console.error("Command execution error:\n\n" + e);
    }
});

// Bot login
try {
    client.login(secret.token);
} catch(e) {
    console.error("Bot login error:\n" + e);
}
