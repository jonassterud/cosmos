module.exports = {
    name: 'add',
    description: '\:notes: Listen to music from a YouTube video trough a voice channel!',
    args: true,
    usage: '<video | playlist | live | query>',
    async execute(message, args) {
        // Variable(s):
        const voice = message.member.voice.channel;

        // Guard(s):
        if(!voice) return message.channel.send(`\:no_entry: Please join a voicechannel before executing the command, <@${message.author.id}>!`);

        // Create queue:
        if(!queue?.[message.guild.id]) {
            queue[message.guild.id] = {urls: [], playing: false, stream: undefined, dispatcher: undefined, connection: undefined};
        }

        // Extract data (videoID and/or playlistID) from URL:
        const ids = args[0].match(/(v=|youtu\.be\/)(?<video>[^&]+)(?!.*list=)|list=(?<playlist>[^&]+)/);

        // Add songs from playlist:
        if(ids && ids.groups.playlist) {
            (async function getItems(nextPageToken='') {
                let list = {};
                try {
                    // Load videos:
                    list = await youtube.playlistItems.list({
                        playlistId: ids.groups.playlist,
                        part: 'snippet',
                        maxResults: 50,
                        pageToken: nextPageToken
                    });
                } catch(error) {
                    client.logger.error(error);
                    return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
                }

                // Add videos from current page:
                list.data.items.forEach(item => {
                    queue[message.guild.id].urls.push(`www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`);
                });

                // Get items from next page:
                if(list.data.nextPageToken) return getItems(list.data.nextPageToken);

                // Play:
                if(!queue[message.guild.id].playing) play();
                message.channel.send(`\:mailbox: Added songs from the playlist to the queue, <@${message.author.id}>!`);
            })();
        }

        // Add song:
        else if(ids && ids.groups.video) {
            queue[message.guild.id].urls.push(args[0]);
            if(!queue[message.guild.id].playing) play();
            message.channel.send(`\:ok_hand: Added song to the queue, <@${message.author.id}>!`);
        }

        // Add song based on search query:
        else {
            let list = {};
            try {
                list = await youtube.search.list({
                    part: 'snippet',
                    type: 'video',
                    q: args.join(' '),
                    key: process.env.YOUTUBE
                });
            } catch(error) {
                client.logger.error(error);
                return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
            }

            // Guard(s):
            if(!list.data.items.length) return message.channel.send(`\:thinking: No songs were found, <@${message.author.id}>!`);

            // Add to queue:
            const url = 'https://www.youtube.com/watch?v=' + list.data.items[0].id.videoId;
            queue[message.guild.id].urls.push(url);
            if(!queue[message.guild.id].playing) play();
            ytdl.getBasicInfo(url, (err, data) => {
                if(err) message.channel.send(`\:mag: Added song based on your search query, <@${message.author.id}>!`);
                else message.channel.send(`\:mag: Added "*${data.title}*" based on your search query, <@${message.author.id}>!`);
            });
        }

        // Play function:
        async function play() {
            // Create connection:
            try {
                queue[message.guild.id].connection = await voice.join();
                queue[message.guild.id].playing = true;
            } catch(error) {
                client.logger.error(error);
                return message.channel.send(`\:no_entry: Something went wrong, <@${message.author.id}>!`);
            }

            // Download song:
            queue[message.guild.id].stream = ytdl(queue[message.guild.id].urls[0], {
                quality: 'highestaudio',
                highWaterMark: 1024 * 1024 * 30, // 30mb
                liveBuffer: 1000 * 60 * 5 // 5 minutes
            });

            // Play stream:
            queue[message.guild.id].dispatcher = queue[message.guild.id].connection.play(queue[message.guild.id].stream, {
                highWaterMark: 1,
                bitrate: 'auto',
                volume: false
            });

            // Finish event:
            queue[message.guild.id].dispatcher.on('finish', () => {
                queue[message.guild.id].urls.shift();
                if(queue[message.guild.id].urls.length) {
                    message.channel.send('\:ok_hand: Playing next song from queue..');
                    return play();
                } else {
                    voice.leave();
                    queue[message.guild.id].connection.disconnect();
                    delete queue[message.guild.id];
                    return message.channel.send('\:weary: Session over!');
                }
            });
        }
    }
};
