// Global variables
queue = [];
currentSong = 0;
connection = {};

// Command
module.exports = {
    name: 'bettermusic',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<YouTube URL, \'skip\', \'queue\', \'play\' or \'pause\'>',
    execute(message, args) {
        // Variables:
        voice = message.member.voiceChannel;

        // Check arguments:
        if(args[0] === "queue") {
            let embed = new Discord.RichEmbed();
            embed.setTitle("Music queue:")
            embed.setColor('#ff0000');
            queue.forEach((e, i) => {
                if(i >= currentSong) {
                    embed.addField('Song ' + (i + 1) + ': ', e.title);
                }
            });
            return message.channel.send(embed);
        }
        
        else if(args[0] === "skip") {
            voice.leave();
            connection.disconnect();
            currentSong++;
            return this.execute(message, ["play"]);
        }
        
        else if(args[0] === "pause") {
            if(connection.hasOwnProperty('dispatcher')) {
                if(connection.dispatcher.paused) {
                    connection.dispatcher.resume();
                    return message.channel.send("\:play_pause: Unpaused the music, <@" + message.author.id + ">!");
                } else {
                    connection.dispatcher.pause();
                    return message.channel.send("\:play_pause: Paused the music, <@" + message.author.id + ">!");
                }
            }
        }

        else if(args[0] === "play") {
            // Check if queue has ended:
            if(currentSong >= queue.length) {
                queue = [], currentSong = 0;
                return message.channel.send("\:frowning: Session over!");
            }

            // Check if song is paused:
            else if(connection.hasOwnProperty('dispatcher') && connection.dispatcher.paused) {
                return this.execute(message, ['pause']);
            }

            // Play song:
            else {
                // Create stream:
                stream = ytdl(queue[currentSong].link, {
                    filter: 'audioonly',
                    // quality: 'lowest',
                    liveBuffer: 60000,
                    highWaterMark: 1024 * 1024 * 10
                });

                setTimeout(() => {
                    voice.join().then(e => {
                        connection = e;

                        // Start stream:
                        dispatcher = e.playStream(stream);
                        dispatcher.setBitrate('auto');

                        // Events
                        connection.dispatcher.on('end', () => this.execute(message, ['skip']));
                    });
        
                    return message.channel.send("\:musical_note: Now playing: \`" + queue[currentSong].title + "\`");
                }, 500);
            }
        }

        else {
            // Add to queue from link:
            const validLink = /^https:\/\/www\.youtube\.com\/((playlist\?list=)|(watch\?v=)).*/m;
            if(validLink.test(args[0])) {
                ytdl.getBasicInfo(args[0]).then(e => {
                    queue.push({
                        link: args[0], 
                        title: e.title
                    });

                    message.delete();
                    return message.channel.send("\:ok_hand: Added song(s) to the queue, <@" + message.author.id + ">!");
                });
            }
        }
    }
};