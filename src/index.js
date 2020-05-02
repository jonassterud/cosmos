// Packages
require('dotenv').config();
global.config = require('./config.json'); // Secret data
global.fs = require('fs'); // Node.js package - file system
global.Discord = require('discord.js'); // Node.js package - Discord API
global.http = require('http'); // Node.js packae - Request data from APIs
global.https = require('https'); // Node.js packae - Request data from APIs
global.ytdl = require('ytdl-core'); // Node.js package - Downloads YouTube videos
global.youtube = require('googleapis').google.youtube({version: 'v3', auth: process.env.YOUTUBE}); // Youtube API

// Globals
global.queue = {};

// Create bot
client = new Discord.Client();

// Create commands
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