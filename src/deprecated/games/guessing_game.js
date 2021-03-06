

module.exports = class GuessingGame {
    constructor(channel, sessions) {
        this.channel = channel;
        this.sessions = sessions;
        this.number = Math.round(Math.random() * 1000);
        channel.send("I am thinking of a number between 0 and 1000...");
        console.log("Number: " + this.number);
    }

    update(message) {
        const channel = message.channel;
        if (channel === this.channel) {
            if (!isNaN(message.content)) {
                const n = Number(message.content);
                if (n === this.number) {
                    channel.send(`${message.author} guessed correct! The number was ${this.number}`);
                }
                else if (n > this.number) {
                    channel.send(`${n} guessed, but it is too big!`)
                }
                else {
                    channel.send(`${n} guessed, but it is too small!`)
                }
            }
        }
    }
}