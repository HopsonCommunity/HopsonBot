const MockMessage = require('./mock_message');

module.exports = class {
    /**
     * Creates a "mock" discord channel
     * @param {String} name The name of the channel
     */
    constructor(name = "Default") {
        this.messages = [];
        this.name = name;
        
        this.type = "text";
    }

    /**
     * Sends a "mock message" to this channel
     * @param {String} The message to send to the channel
     */
    send(message) {
        const msg = new MockMessage(message, {});
        this.messages.push(msg);
        return {
            then: f => f(msg)
        }
    }

    /**
     * Gets the last message sent
     */
    lastMessage() {
        return this.messages[this.messages.length - 1];
    }
}