// Global variables
let queue = {};
const {google} = require('googleapis'); // Make global to entire project?
const youtube = google.youtube({version: 'v3', auth: secret.youtube}); // Make global to entire project?

// Command
module.exports = {
    name: 'newmusic',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<YouTube video or playlist | skip | queue | pause | resume>',
    execute(message, args) {
        // Variables:
        const voice = message.member.voiceChannel;

        // Check voice:
        if (!voice) return message.channel.send("\:no_entry: Please join a voicechannel before executing the command, <@" + message.author.id + ">!");

        // Check argument:
        switch(args[0].toLowerCase()) {
            case 'pause': {
                if(!queue[message.guild.id].dispatcher.paused) {
                    message.channel.send("Paused song, <@" + message.author.id + ">!");
                    queue[message.guild.id].dispatcher.pause(true);
                }
                break;
            }
            case 'resume': {
                if(queue[message.guild.id].dispatcher.paused) {
                    message.channel.send("Resumed song, <@" + message.author.id + ">!");
                    queue[message.guild.id].dispatcher.resume();
                }
                break;
            }
            case 'skip': {
                queue[message.guild.id].dispatcher.end();
                break;
            }
            case 'queue': {
                // Create embed:
                let embed = new Discord.RichEmbed()
                    .setTitle("Song queue \:musical_note:")
                    .setColor('#ff0000')
                    .setTimestamp(new Date());

                // Loop trough songs:
                const maxSize = 10;
                for(let i=0; i<queue[message.guild.id].urls.length && i<maxSize; i++) {
                    ytdl.getBasicInfo(queue[message.guild.id].urls[i], (err, data) => {
                        // Fill embed:
                        const length = (parseInt(data.length_seconds) / 60).toFixed(2) + " minutes";
                        embed.addField((i + 1) + '.', "Title: *" + data.title + "*\nDuration: *" + length + "*");

                        // Send embed if ready:
                        if(i >= maxSize-1) embed.addField("...", "and more!");
                        if(i >= queue[message.guild.id].urls.length - 1 || i >= maxSize-1) message.channel.send(embed);
                    });
                }
                break;
            }
            default: {
                // Create queue:
                if(!queue[message.guild.id]) {
                    queue[message.guild.id] = {
                        urls: [], 
                        playing: false, 
                        stream: undefined, 
                        dispatcher: undefined
                    };
                }

                // Check if URL is playlist:
                if(/list=([^&]+)/.test(args[0])) {
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
                } else {
                    // Add to queue:
                    queue[message.guild.id].urls.push(args[0]);
                }
                
                // Play:
                if(!queue[message.guild.id].playing) play();
                else message.channel.send("\:ok_hand: Added song(s) to queue..");
                break;
            }
        }

        // Functions:
        function play() {
            // Join channel:
            voice.join().then(connection => {
                // Force state:
                queue[message.guild.id].playing = true;

                // Download song:
                queue[message.guild.id].stream = ytdl(queue[message.guild.id].urls.shift(), {
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
                    if(queue[message.guild.id].urls.length) {
                        message.channel.send("\:ok_hand: Playing next song from queue..");
                        play();
                    } else {
                        voice.leave();
                        connection.disconnect();
                    }
                });
            });
        }
    }
};
