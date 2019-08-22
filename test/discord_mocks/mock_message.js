module.exports = class {
    constructor(content, channel, author = "testAuthor") {
        this.content = content;
        this.author = author;
        this.channel = channel;
        this.reactions = [];
    }

    react(reaction) {
        console.log("reaction gone sexual: ", reaction);
        this.reactions.push(reaction);
    }
}