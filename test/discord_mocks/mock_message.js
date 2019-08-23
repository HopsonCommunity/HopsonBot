const MockGuildMember = require('./mock_guild_member')
const MockUser = require('./mock_user')

module.exports = class {
    /**
     * Creates a mock message
     * @param {String} content The content of a message
     * @param {MockChannel} channel The channel to send the message to
     * @param {MockMember} member The member who sent the message
     * @param {MockUser} author The user who sent the message
     */
    constructor(content, channel, member, author = new MockUser()) {
        this.content = content;
        this.author = author;
        this.member = member;
        this.channel = channel;
        this.reactions = [];
    }

    /**
     * Reacts to the message with an emoji
     * @param {Char} reaction The emoji to react with
     */
    react(reaction) {
        this.reactions.push(reaction);
    }
}