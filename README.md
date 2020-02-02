# Cosmos - The Discord Bot

[Invite me!](https://discordapp.com/oauth2/authorize?client_id=672828141743374340&scope=bot&permissions=2146958591)

[What's next?](https://github.com/jonassterud/Cosmos/projects/1)

[What's wrong?](https://github.com/jonassterud/Cosmos/issues)

## Requirements
* [Node.js](https://nodejs.org/en/)
* [Discord.js](https://discord.js.org/#/) `npm install discord.js`
* [Request](https://www.npmjs.com/package/request) `npm install request`
* *config.json*

### The *config.json* file
The *config.json* file holds secret information such as the the [Discord bot token](https://discordapp.com/developers/applications/), the [Pixabay API token](https://pixabay.com/no/service/about/api/) and the [API token for Giphy](https://developers.giphy.com/dashboard/). The *config.json* file should be inside the *src* folder, and it should look like this:
```
{
    "prefix": "your prefix here",
    "token": "your Discord bot token here",
    "pixabay": "your Pixabay API token here",
    "giphy": "your Giphy API token here"
}
```
