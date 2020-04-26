// Get libraries
require('dotenv').config()
global.secret = require('./config.json'); // Secret data
global.fs = require('fs'); // Node.js package - file system
global.Discord = require('discord.js'); // Node.js package - Discord API
global.request = require('request'); // Node.js package - request website data
global.ytdl = require('ytdl-core'); // Node.js package - Downloads YouTube videos
global.google = require('googleapis').google; // Google API
global.youtube = google.youtube({version: 'v3', auth: secret.youtube}); // Youtube API

// Create bot
global.client = new Discord.Client();

// Create commands
client.commands = new Discord.Collection();
client.loader = require('./modules/Loader')

const init = async () => {
    const loader = client.loader
    await loader.registerModules(client)
    await loader.registerCommands(client)
    await loader.registerEvents(client)
    await loader.checkDiscordStatus(client)
    await client.login(process.env.TOKEN)
}

init()
