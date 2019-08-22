module.exports = class {
    constructor(name = "Default") {
        this.messages = [];
        this.name = name;
        
        this.type = "text";
    }

    send(message) {
        this.messages.push(message);
    }
}