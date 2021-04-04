module.exports = {
    name: "reload",
    description: ":arrows_counterclockwise: Use this command to reload a given command!",
    args: false,
    usage: "<command>",
    async execute(message, args) {
        //not for everyone
        if (!["181250087442317312", "305074536825749504"].includes(message.author.id)) {
            return message.channel.send(`\:no_entry: Permission denied!`);
        }
        const client = message.client;
        if (args == undefined || args.length == 0) {
            await client.loader.registerCommands(client);
            return message.channel.send(`\:arrows_counterclockwise: Reloaded all commands!`);
        }
        const cmdName = args[0];
        const dirs = fs.readdirSync("./commands/").filter((file) => fs.statSync(`./commands/${file}`).isDirectory());
        for (const dir of dirs) {
            const files = fs.readdirSync(`./commands/${dir}`);
            for (const file of files) {
                if (fs.statSync(`./commands/${dir}/${file}`).isDirectory()) {
                    dirs.push(`${dir}/${file}`);
                    continue;
                }
                if (file.split(".").shift() == cmdName) {
                    try {
                        delete require.cache[require.resolve(`${global.rootPath}/commands/${dir}/${file}`)];
                        const newProperties = require(`${global.rootPath}/commands/${dir}/${file}`);
                        client.commands.set(newProperties.name, newProperties);
                        return message.channel.send(`\:arrows_counterclockwise: Command: ${cmdName} reloaded!`);
                    } catch (e) {
                        client.logger.error(`Something went wrong trying to reload a file via the reload command!`);
                        client.logger.error(e);
                        return;
                    }
                }
            }
        }

        //Couldn't find the specified command
        return message.channel.send(`\:no_entry: I wasn't able to find the command: "${cmdName}"`);
    },
};
