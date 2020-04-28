// Get libraries
require('dotenv').config();
global.secret = require('./config.json'); // Secret data
global.fs = require('fs'); // Node.js package - file system
global.Discord = require('discord.js'); // Node.js package - Discord API
global.request = require('request'); // Node.js package - request website data
global.ytdl = require('ytdl-core'); // Node.js package - Downloads YouTube videos
global.youtube = require('googleapis').google.youtube({version: 'v3', auth: process.env.YOUTUBE}); // Youtube API

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
