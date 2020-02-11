const ytdl = require('ytdl-core');
let queue = [],
    playing = false;

module.exports = {
    name: 'music',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<url>',
    execute(message, args) {
        // Variables:
        const voice = message.member.voiceChannel;

        // Add to queue:
        //Make sure this is actually a youtube link
        const re = /youtube.com\/watch\?v=[a-zA-Z\d\=\&]+$/g
        let ytbUrl = args[0];

        if (!re.test(ytbUrl)) return message.channel.send("\:no_entry: Please enter a valid youtube url");

        queue.push(ytbUrl);
        message.channel.send("\:ok_hand: The video was added to the queue, <@" + message.author.id + ">!");

        // Play:
        if (!playing) play();

        function play() {
            if (queue.length) {
                // Change state:
                playing = true;
                // Print title:
                ytdl.getInfo(queue[0]).then(info => message.channel.send("\:musical_note: Now playing: " + info.title)).catch();

                // Play song:
                voice.join().then(connection => {
                    // Variables:

                    const stream = ytdl(queue[0], {
                        quality: "lowest"
                    });

                    const dispatcher = connection.playStream(stream, {
                        seek: 0,
                        volume: 1
                    });

                    // Finished song event:
                    dispatcher.on('end', () => {
                        queue.shift();
                        play();
                    });

                }).catch((e) => console.log("err"));

            } else {
                playing = false;
                voice.leave();
                return message.channel.send("\:frowning: Session over. No more songs in queue!");
            }
        }
    }
};