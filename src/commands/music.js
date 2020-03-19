// Global variables
let queue = [], playing = false, connection = "";
const {google} = require('googleapis');
const youtube = google.youtube({version: 'v3', auth: secret.youtube});

// Command
module.exports = {
    name: 'music',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<YouTube URL, \'skip\' or \'queue\'>',
    execute(message, args) {
        // Variables:
        const voice = message.member.voiceChannel;
        
        // Check for errors:
        if (!voice) return message.channel.send("\:no_entry: Please join a voicechannel before executing the command, <@" + message.author.id + ">!");

        // Check arguments:
        if (args[0] === 'skip') {
            if(connection != "") {
                connection.dispatcher.end();
                return message.channel.send("\:cd: Skipping song...");
            }
            return message.channel.send("No songs in queue " + message.author);
        }
        if(args[0] === 'queue') {
            if (!queue.length) return message.channel.send("No songs in queue " + message.author);

            let embed = new Discord.RichEmbed()
                .setTitle("Song queue \:musical_note:")
                .setColor('#ff0000')
                .setTimestamp(new Date());

            const loop = async () => {
                for (let i = 0; i < queue.length; i++) {
                    let songUrl = queue[i];
                    await ytdl.getInfo(songUrl).then(info => {
                        if (i == 0) embed.addField("Current song:", " " + info.title);
                        else embed.addField("Song number " + i + ":", " " + info.title);
                        if (i == queue.length - 1) return message.channel.send(embed);
                    }).catch(e => {
                        console.log("Error getting song info.\nERROR:\n" + e);
                    });
                }
            }

            return loop();
        }

        // Check for errors:
        const re = /youtube.com\/watch\?v=[a-zA-Z\d\=\&\-\_]+$/g

        if (!re.test(args[0])) {
            const query = args.join(" ");
            youtube.search.list({
                part: 'snippet',
                type: 'video',
                order: 'relevance',
                q: query,
                maxResults: 10,
                key: secret.youtube
            }).then((searchRequest) => {
                const result = searchRequest.data.items[0];
                const youtubeUrl = ('https://www.youtube.com/watch?v=' + result.id.videoId);
                queue.push(youtubeUrl);
                ytdl.getInfo(youtubeUrl).then(info => message.channel.send("\:ok_hand: Added: " + '"' + info.title + '"' + " to the queue!")).catch();
                tryPlay();
            }).catch(e => console.error(e));
            return;
        }

        // Add to queue:
        queue.push(args[0]);
        ytdl.getInfo(args[0]).then(info => message.channel.send("\:ok_hand: Added: " + '"' + info.title + '"' + " to the queue!")).catch();
        
        // Play:
        function tryPlay() {
            if (!playing) {
                if (connection === '') {
                    voice.join().then(conn => {
                        connection = conn;
                        play();
                    }).catch();
                } else {
                    play();
                }
            }
        }
        tryPlay();

        function play() {
            if (queue.length) {
                // Change state:
                playing = true;

                // Print title:
                ytdl.getInfo(queue[0]).then(info => message.channel.send("\:musical_note: Now playing: " + info.title)).catch();

                // Play song:
                let stream = ytdl(queue[0], {
                    quality: "highest",
                    filter: "audioonly",
                    highWaterMark: 1024 * 1024 * 10 /*10 Megabytes, default is 16kb*/
                });
                let disp = connection.playStream(stream, {
                    seek: 0,
                    volume: 1,
                });
                disp.setBitrate('auto');

                // Finished song event:
                disp.on('end', () => {
                    queue.shift();
                    playing = false;
                    tryPlay();
                });
            } else {
                playing = false;
                connection = "";
                message.channel.send("\:frowning: Session over. No more songs in queue!");
                voice.leave();
                return;
            }
        }
    }
};