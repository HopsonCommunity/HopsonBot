/**
 * A "struct" to hold message information for commands
 */
module.exports = class MessageInfo {
    /**
     * Construct message info struct
     * @param {Discord TextMessage} message Raw message sent by user
     */
    constructor (message) {
        this.isRealTextMessage = (!
            (message.channel.type !== "text") || 
            (message.author.bot));

        this.isCommand = message.content.startsWith('>');
        const content = message.content
                            .slice(1)   //Remove the '>'
                            .split(' ')
                            .map((s) => {
                                return s.toLowerCase()
                            });
        //Info for commands
        this.commandCategory    = content[0];
        this.args               = content.slice(1);

        this.channel            = message.channel;
        this.msg                = message;

        this.user               = message.member;
    }

    logInfo() {
        const ch = this.channel.name;
        const user = this.msg.member.displayName;
        const msg = this.msg.content;
        const cat = this.commandCategory;
        const args = this.args.join(', ');

        console.log("============")
        console.log(`Message Sent\nChannel: ${ch}\nUser: ${user}\nContent: ${msg}\nCategory: ${cat}\nArgs: ${args}`);
        console.log("============\n")
    }
}