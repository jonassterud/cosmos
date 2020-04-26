// Global variables
let queue = {};

// Command
module.exports = {
    name: 'newmusic',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<YouTube video or playlist | skip [amount] | queue | pause | resume | reset>',
    execute(message, args) {
        // Variables:
        const voice = message.member.voiceChannel;

        // Check voice:
        if (!voice) return message.channel.send("\:no_entry: Please join a voicechannel before executing the command, <@" + message.author.id + ">!");

        // Check argument:
        switch(args[0].toLowerCase()) {
            case 'pause': {
                // Guards:
                if(!queue[message.guild.id] || !queue[message.guild.id].dispatcher) return message.channel.send("\:no_entry: I'm not playing anything yet, <@" + message.author.id + ">!");
                if(queue[message.guild.id].dispatcher.paused) return message.channel.send("\:question: I'm already paused, <@" + message.author.id + ">!");

                // Pause:
                message.channel.send("\:pause_button: Paused song, <@" + message.author.id + ">!");
                queue[message.guild.id].dispatcher.pause(true);
                break;
            }
            case 'resume': {
                // Guards:
                if(!queue[message.guild.id] || !queue[message.guild.id].dispatcher) return message.channel.send("\:no_entry: I'm not playing anything yet, <@" + message.author.id + ">!");
                if(!queue[message.guild.id].dispatcher.paused) return message.channel.send("\:question: I'm not paused, <@" + message.author.id + ">!");

                // Resume:
                message.channel.send("\:arrow_forward: Resumed song, <@" + message.author.id + ">!");
                queue[message.guild.id].dispatcher.resume();
                break;
            }
            case 'skip': {
                // Guards:
                if(!queue[message.guild.id] || !queue[message.guild.id].connection) return message.channel.send("\:no_entry: I'm not playing anything yet, <@" + message.author.id + ">!");

                // Call end event:
                if(args[1] && /^\d+$/m.test(args[1])) {                
                    if(parseInt(args[1]) <= queue[message.guild.id].urls.length) {
                        queue[message.guild.id].urls.splice(0, parseInt(args[1]));
                    } else {
                        message.channel.send("\:no_entry: Number is out of range, <@" + message.author.id + ">!");
                    }
                }
                queue[message.guild.id].dispatcher.end();
                break;
            }
            case 'reset': {
                // Guards:
                if(!queue[message.guild.id]) return message.channel.send("\:no_entry: There is nothing to reset, <@" + message.author.id + ">!");
                
                // Reset:
                
                queue[message.guild.id].urls = [];
                queue[message.guild.id].dispatcher.end();
                message.channel.send("\:firecracker: Cleared queue!");
                break;
            }
            case 'wrongsong': {
                // Guards:
                if(!queue[message.guild.id] || !queue[message.guild.id].urls) return message.channel.send("\:no_entry: Queue is empty, <@" + message.author.id + ">!");

                // Remove last song:
                ytdl.getBasicInfo(queue[message.guild.id].urls.pop()).then(data => {
                    message.channel.send("\:open_mouth: Removed " + '"*' + data.title + '*"' + " from the queue, <@" + message.author.id + ">!");
                });
                break;
            }
            case 'queue': {
                // Guards:
                if(!queue[message.guild.id] || !queue[message.guild.id].urls) return message.channel.send("\:no_entry: Queue is empty, <@" + message.author.id + ">!");

                // Create embed:
                let embed = new Discord.RichEmbed()
                    .setTitle("Song queue \:musical_note:")
                    .setColor('#ff0000')
                    .setTimestamp(new Date());

                // Loop trough songs:
                const maxSize = 3;
                (async function addItems() {
                    for(let i=0; i<queue[message.guild.id].urls.length && i<maxSize; i++) {
                        await ytdl.getBasicInfo(queue[message.guild.id].urls[i], (err, data) => { // s
                            // Fill embed:
                            const length = (parseInt(data.length_seconds) / 60).toFixed(2) + " minutes";
                            embed.addField((!i ? "Currently playing:" : i + "."), "Title: *" + data.title + "*\nDuration: *" + length + "*");
                            
                            // Show remaining songs:
                            const remaining = queue[message.guild.id].urls.length - maxSize;
                            if(i >= maxSize) embed.addField("...", "and " + remaining + " more!");
                        });
                    }
                })().then(() => message.channel.send(embed));
                break;
            }
            default: {
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

                // Extract data from URL:
                const regexResult = /www\.youtube\.com\/(?:watch\?v=([^&]+)|playlist\?)(?:&*list=([^&]+))*/.exec(args[0]);

                // Add to queue based on URL type:
                if(!regexResult) { // Search
                    youtube.search.list({
                        part: 'snippet',
                        type: 'video',
                        q: args.join(" "),
                        key: secret.youtube
                    }).then(response => {
                        const url = 'https://www.youtube.com/watch?v=' + response.data.items[0].id.videoId;
                        queue[message.guild.id].urls.push(url);
                        ytdl.getBasicInfo(url).then(data => {
                            message.channel.send("\:ok_hand: Added " + '"*' + data.title + '*"' + " based on your search query, <@" + message.author.id + ">!");
                        });
                    });
                }
                else if(regexResult[2]) { // Playlist
                    (function getItems(nextPageToken='') {
                        youtube.playlistItems.list({
                            playlistId: args[0].match(/list=([^&]+)/)[1],
                            part: 'snippet',
                            maxResults: 50,
                            pageToken: nextPageToken
                        }).then(response => {
                            response.data.items.forEach(item => {
                                queue[message.guild.id].urls.push("www.youtube.com/watch?v=" + item.snippet.resourceId.videoId);
                            });
                            if(response.data.nextPageToken) getItems(response.data.nextPageToken);
                        });
                    })();
                    message.channel.send("\:ok_hand: Added songs from the playlist to the queue, <@" + message.author.id + ">!");
                } else if(regexResult[1] && !regexResult[2]) { // Video
                    queue[message.guild.id].urls.push(args[0]);
                    message.channel.send("\:ok_hand: Added song to the queue, <@" + message.author.id + ">!");
                }
                
                // Play:
                if(!queue[message.guild.id].playing) play();
                break;
            }
        }

        // Functions:
        function play() {
            // Join channel:
            voice.join().then(connection => {
                // Update queue variables:
                queue[message.guild.id].connection = connection;
                queue[message.guild.id].playing = true;

                // Download song:
                queue[message.guild.id].stream = ytdl(queue[message.guild.id].urls[0], {
                    quality: "highestaudio",
                    filter: "audioonly",
                    highWaterMark: 1024 * 1024 * 30 // 30mb
                });
    
                // Play stream:
                queue[message.guild.id].dispatcher = connection.playStream(queue[message.guild.id].stream, {
                    highWaterMark: 1,
                    bitrate: 'auto'
                });

                // Set volume:
                queue[message.guild.id].dispatcher.setVolumeDecibels(-16);
    
                // End event:
                queue[message.guild.id].dispatcher.on('end', () => {
                    queue[message.guild.id].urls.shift();
                    if(queue[message.guild.id].urls.length) {
                        message.channel.send("\:ok_hand: Playing next song from queue..");
                        play();
                    } else {
                        voice.leave();
                        connection.disconnect();
                        delete queue[message.guild.id];
                    }
                });
            });
        }
    }
};
