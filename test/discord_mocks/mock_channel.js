module.exports = class {
    constructor(name = "Default") {
        this.messages = [];
        this.name = name;
        
        this.type = "text";
    }

    send(message) {
        this.messages.push(message);
    }

    lastMessage() {
        return this.messages[this.messages.length - 1];
    }
}