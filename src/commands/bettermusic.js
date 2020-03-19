// Global variables
let queue = [], currentSong = 0;

// Command
module.exports = {
    name: 'bettermusic',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<YouTube URL, \'skip\' or \'queue\'>',
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
        
        if(args[0] === "skip") {
            currentSong++;
            message.channel.send("\:cd: Skipping to the next song from the queue..");
            return this.execute(message, ["play"]);
        }

        if(args[0] === "play") {
            // Reset previous:
            connection = {}, stream = {};

            // Check if song has ended:
            if(currentSong >= queue.length) {
                voice.leave();
                return message.channel.send("\:frowning: Session over. No more songs in queue!");
            }

            // Create stream:
            stream = ytdl(queue[currentSong].link, {
                filter: 'audioonly',
                quality: 'lowest',
                liveBuffer: 60000,
                highWaterMark: 1024 * 1024 * 10
            });

            setTimeout(() => {
                voice.join().then(e => {
                    connection = e;

                    // Start stream:
                    dispatcher = e.playStream(stream);
                    dispatcher.setBitrate('auto');

                    // Events:
                    dispatcher.on('end', () => {
                        currentSong++;
                        this.execute(message, ["play"]);
                    });
                });
                
                return message.channel.send("\:musical_note: Now playing: " + queue[currentSong].title);
            }, 2500);
        }

        // Add to queue from link:
        const validLink = /^https:\/\/www\.youtube\.com\/((playlist\?list=)|(watch\?v=)).*/m;
        if(validLink.test(args[0])) {
            ytdl.getBasicInfo(args[0]).then(e => {
                queue.push({
                    link: args[0], 
                    title: e.title
                });
                
                return message.channel.send("\:ok_hand: Added song(s) to the queue, <@" + message.author.id + ">!");
            });
        }
    }
};