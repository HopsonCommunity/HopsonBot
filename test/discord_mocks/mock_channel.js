const MockMessage = require('./mock_message');
module.exports = class {
    constructor(name = "Default") {
        this.messages = [];
        this.name = name;
        
        this.type = "text";
    }

    send(message, success = true) {
        const msg = new MockMessage(message, {});
        this.messages.push(msg);
        return {
            then: f => f(msg)
        }
    }

    lastMessage() {
        return this.messages[this.messages.length - 1];
    }
}