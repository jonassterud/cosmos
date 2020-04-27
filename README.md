![Image](https://i.ibb.co/dLp1FSX/Untitled.png)


## Info
[Invite me!]() (*Coming Soon*)

[What's next?](https://github.com/jonassterud/Cosmos/projects/1)

[Something wrong?](https://github.com/jonassterud/Cosmos/issues)

## Secrets
Secrets are stored in a *.env* file. It holds holds secret information such as the the [Discord bot token](https://discordapp.com/developers/applications/), the [Pixabay API token](https://pixabay.com/no/service/about/api/), the [API token for Giphy](https://developers.giphy.com/dashboard/) and the [YouTube API token](https://console.cloud.google.com/projectcreate). The *.env* file should be inside the *src* folder, and it should look like this:
```
{
    TOKEN=Discord bot token here
    YOUTUBE=YouTube API token here
    GIPHY=Giphy API token here
    PIXABAY=Pixabay API token here
}
```

## The *config.json* file
The *config.json* file holds configuration data, like the bot prefix. The *config.json* file should be inside the *src* folder, and it should look like this:
```
{
    "prefix": "Your prefix here",
}
```
