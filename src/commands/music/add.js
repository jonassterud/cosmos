// Command
module.exports = {
    name: 'add',
    description: '\:musical_note: Listen to music from a YouTube video trough a voice channel!',
    args: true,
    usage: '<Video | Playlist | Live>',
    execute(message, args) {
        // Variables:
        const voice = message.member.voice.channel;

        // Guard:
        if(!voice) return message.channel.send('\:no_entry: Please join a voicechannel before executing the command, <@' + message.author.id + '>!');

        // Create queue:
        if(!queue[message.guild.id]) {
            queue[message.guild.id] = {
                urls: [],
                playing: false,
                stream: undefined,
                dispatcher: undefined,
                connection: undefined
            };
        }

        // Extract data (videoID and/or playlistID) from URL:
        const regexResult = /www\.youtube\.com\/(?:watch\?v=([^&]+)|playlist\?)(?:&*list=([^&]+))*/.exec(args[0]);

        // Add to queue based on URL type:
        if(!regexResult) { // Search
            youtube.search.list({
                part: 'snippet',
                type: 'video',
                q: args.join(' '),
                key: process.env.YOUTUBE
            }).then(response => {
                // Guard:
                if(!response.data.items.length) return message.channel.send('\:thinking: No songs were found, <@' + message.author.id + '>!');

                // Add to queue:
                const url = 'https://www.youtube.com/watch?v=' + response.data.items[0].id.videoId;
                queue[message.guild.id].urls.push(url);
                if(!queue[message.guild.id].playing) play();
                ytdl.getBasicInfo(url, (err, data) => {
                    if(err) {
                        message.channel.send('\:ok_hand: Added song based on your search query, <@' + message.author.id + '>!');
                    } else {
                        message.channel.send('\:ok_hand: Added ' + '"*' + data.title + '*"' + ' based on your search query, <@' + message.author.id + '>!');
                    }
                });
            });
        } else if(regexResult[2]) { // Playlist
            (function getItems (nextPageToken = '') {
                youtube.playlistItems.list({
                    playlistId: args[0].match(/list=([^&]+)/)[1],
                    part: 'snippet',
                    maxResults: 50,
                    pageToken: nextPageToken
                }).then(response => {
                    // Add videos from current page:
                    response.data.items.forEach(item => {
                        queue[message.guild.id].urls.push('www.youtube.com/watch?v=' + item.snippet.resourceId.videoId);
                    });

                    // Get items from next page:
                    if(response.data.nextPageToken) return getItems(response.data.nextPageToken);

                    // Play:
                    if(!queue[message.guild.id].playing) play();
                    message.channel.send('\:ok_hand: Added songs from the playlist to the queue, <@' + message.author.id + '>!');
                }).catch(() => {
                    return message.channel.send('\:thinking: Something went wrong, <@' + message.author.id + '>!');
                });
            })();
        } else if(regexResult[1] && !regexResult[2]) { // Song
            queue[message.guild.id].urls.push(args[0]);
            if(!queue[message.guild.id].playing) play();
            message.channel.send('\:ok_hand: Added song to the queue, <@' + message.author.id + '>!');
        }

        // Play function:
        function play () {
            // Join channel:
            voice.join().then(connection => {
                // Update queue variables:
                queue[message.guild.id].connection = connection;
                queue[message.guild.id].playing = true;

                // Download song:
                queue[message.guild.id].stream = ytdl(queue[message.guild.id].urls[0], {
                    quality: 'highestaudio',
                    //filter: 'audioonly', // Doesn't work with (some) live videos!
                    highWaterMark: 1024 * 1024 * 30, // 30mb
                    liveBuffer: 1000 * 60 * 2 // 2 minutes!
                });

                // Play stream:
                queue[message.guild.id].dispatcher = connection.play(queue[message.guild.id].stream, {
                    highWaterMark: 1,
                    bitrate: 'auto',
                    volume: false
                });

                // Finish event:
                queue[message.guild.id].dispatcher.on('finish', () => {
                    queue[message.guild.id].urls.shift();
                    if(queue[message.guild.id].urls.length) {
                        message.channel.send('\:ok_hand: Playing next song from queue..');
                        play();
                    } else {
                        voice.leave();
                        connection.disconnect();
                        delete queue[message.guild.id];
                        message.channel.send('\:weary: Session over!');
                    }
                });
            });
        }
    }
};
