const fs = require('fs'); // Node JS file system, not avalible at all in vanilla js.
const Discord = require("discord.js");
const {prefix,token} = require("../config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();

const comFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

comFiles.forEach((file,i) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name,command);
});

client.once('ready', () => {
  console.log("ready!");
});

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if(!client.commands.has(command)) return;
  try{
    client.commands.get(command).excecute(message,args);
  }catch(e){
    console.error(e);
    message.reply('I\'m sorry, I have some issues excecuting this command');
  }
});

client.login(token);
