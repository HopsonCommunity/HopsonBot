const MockGuildMember = require('./mock_guild_member')
const MockUser = require('./mock_user')

module.exports = class {
    constructor(content, channel, member, author) {
        this.content = content;
        this.author = author;
        this.member = member;
        this.channel = channel;
        this.reactions = [];
    }

    react(reaction) {
        this.reactions.push(reaction);
    }
}