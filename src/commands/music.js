const ytdl = require('ytdl-core');
let queue = [], playing = false;

module.exports = {
	name: 'music',
    description: '\:musical_note: Listen to the audio from a YouTube video in your current voice channel!',
    args: true,
    usage: '<url>',
	execute(message, args) {
        // Variables:
        const voice = message.member.voiceChannel;

        // Add to queue:
        queue.push(args[0]);
        message.channel.send("\:ok_hand: The video was added to the queue, <@" + message.author.id + ">!");

        // Play:
        if(!playing) play();
        
        function play() {        
            if(queue.length) {
                if(!playing) {
                    // Change state:
                    playing = true;

                    // Print title:
                    ytdl.getInfo(queue[0], (e, body) => {
                        message.channel.send("\:musical_note: Now playing: " + body.title);
                    });
    
                    // Play song:
                    voice.join().then(connection => {
                        // Variables:
                        const stream = ytdl(queue[0]);
                        const dispatcher = connection.playStream(stream, {seek: 0, volume: 1});
                        
                        // Finished song event:
                        dispatcher.on('end', () => {
                            queue.shift();
                            playing = false;
                            play();   
                        });
                    });
                }
            } else {
                voice.leave();
                return message.channel.send("\:frowning: Session over. No more songs in queue!");
            }
        }
	}
};