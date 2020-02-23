![Image](https://i.ibb.co/dLp1FSX/Untitled.png)


## Info
[Invite me!]() (*Coming Soon*)

[What's next?](https://github.com/jonassterud/Cosmos/projects/1)

[What's wrong?](https://github.com/jonassterud/Cosmos/issues)

## Requirements
* [Node.js](https://nodejs.org/en/)
* [Discord.js](https://discord.js.org/#/) `npm install discord.js`
* [Request](https://www.npmjs.com/package/request) `npm install request`
* [YTDL - Core](https://www.npmjs.com/package/ytdl-core) `npm install ytdl-core`
* [FFMPEG](https://www.npmjs.com/package/ffmpeg) `npm install ffmpeg`
* [FFMPEG - Binaries](https://www.npmjs.com/package/ffmpeg-binaries) `npm install ffmpeg-binaries`
* [Opusscript](https://www.npmjs.com/package/opusscript) `npm install opusscript`
* [GoogleApis](https://www.npmjs.com/package/googleapis) `npm install googleapis`
* *config.json*

`npm install discord.js request ytdl-core ffmpeg ffmpeg-binaries opusscript`

### The *config.json* file
The *config.json* file holds secret information such as the the [Discord bot token](https://discordapp.com/developers/applications/), the [Pixabay API token](https://pixabay.com/no/service/about/api/) and the [API token for Giphy](https://developers.giphy.com/dashboard/). The *config.json* file should be inside the *src* folder, and it should look like this:
```
{
    "prefix": "your prefix here",
    "token": "your Discord bot token here",
    "pixabay": "your Pixabay API token here",
    "giphy": "your Giphy API token here",
    "youtube": "your Youtube Data API v3 token here"
}
```
