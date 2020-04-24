// Global variables
let queue = {};

// Command
module.exports = {
    name: 'newmusic',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<YouTube URL | skip | queue | pause | resume>',
    execute(message, args) {
        // Variables:
        const voice = message.member.voiceChannel;

        // Check for errrors:
        if (!voice) return message.channel.send("\:no_entry: Please join a voicechannel before executing the command, <@" + message.author.id + ">!");

        // Check argument:
        switch(args[0].toLowerCase()) {
            case 'pause':
                if(!queue[message.guild.id].dispatcher.paused) {
                    queue[message.guild.id].dispatcher.pause(true);
                }
                break;
            case 'resume':
                if(queue[message.guild.id].dispatcher.paused) {
                    queue[message.guild.id].dispatcher.resume();
                }
                break;
            case 'skip':
                queue[message.guild.id].dispatcher.end();
                break;
            case 'queue':

                break;
            default:
                // Create queue:
                if(!queue[message.guild.id]) {
                    queue[message.guild.id] = {
                        urls: [], 
                        playing: false, 
                        stream: undefined, 
                        dispatcher: undefined
                    };
                }

                // Add to queue:
                queue[message.guild.id].urls.push(args[0]);

                // Play:
                if(!queue[message.guild.id].playing) play();
                break;
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
                queue[message.guild.id].dispatcher.setVolumeDecibels(-14);
    
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
