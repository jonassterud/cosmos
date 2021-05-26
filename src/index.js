// Package(s):
require('dotenv').config();
global.config = require('./config.json'); // Secret data
global.fs = require('fs'); // Node.js package - file system
global.Discord = require('discord.js'); // Node.js package - Discord API
global.http = require('http'); // Node.js packae - Request data from APIs
global.https = require('https'); // Node.js package - Request data from APIs
global.ytdl = require('ytdl-core'); // Node.js package - Downloads YouTube videos
global.youtube = require('googleapis').google.youtube({ version: 'v3', auth: process.env.YOUTUBE }); // Youtube API
global.decks = require('cards').decks; // Node.js package - Playing cards API
global.moment = require('moment'); // Node.js package - Dates and time
if(process.env.ALPHAVANTAGE) {
    global.finance = require('alphavantage')({ key: process.env.ALPHAVANTAGE }); // Node.js package - Wrapper for Alpha Vantage API
}
global.rootPath = __dirname;

// Global(s):
global.queue = {};
global.accounts = fs.existsSync('./backups/accounts.json') ? JSON.parse(fs.readFileSync('./backups/accounts.json')) : {};

// Backup loop:
setInterval(() => {
    if(!fs.existsSync('./backups')) fs.mkdirSync('./backups');
    fs.writeFileSync('./backups/accounts.json', JSON.stringify(accounts, null, 4));
}, 1000 * 60 * 5);

// Create bot:
client = new Discord.Client();

// Create commands:
client.commands = new Discord.Collection();
client.loader = require('./modules/Loader');

(async () => {
    const loader = client.loader;
    await loader.registerModules(client);
    await loader.registerCommands(client);
    await loader.registerEvents(client);
    await loader.checkDiscordStatus(client);
    await client.login(process.env.TOKEN);
})();
