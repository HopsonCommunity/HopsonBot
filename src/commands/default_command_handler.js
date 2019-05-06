const CommandHandler    = require('./command_handler');
const Util              = require('../util')

module.exports = class RoleEventHandler extends CommandHandler {
    constructor() {
        super('');
        this.initCommands();
    }
    
    initCommands() {
        super.addBasicCommand(  
            "source", 
            "Get the HopsonBot source code (link to GitHub", 
            "https://github.com/HopsonCommunity/HopsonBot");
        super.addCommand(
            "8ball", 
            "Ask the magic 8ball for some wisdom.",
            ">8ball Will Hopson upload tomorrow?",
            eightball
        )
    }


    getCommands() {
        return new Map([...this.simpleCommands, ...this.commands])
    }
}

//8-ball command
const BALL_RESULTS = ["Yes.", "Reply hazy, try again.", "Without a doubt.",
            "My sources say no.", "As I see it, yes.", "You may rely on it.",
            "Concentrate and ask again.", "Outlook not so good",
            "It is decidedly so.", "Better not tell you now.",
            "Very doubtful.", "Yes - definitely.", "It is certain.",
            "Cannot predict now.", "Most likely.", "Ask again later.",
            "My reply is no.", "Outlook good.", "Don't count on it.",
            "Are you kidding?", "Probably.", "Yes, in due time.", "Go away.",
            "Hopson is more likely to put out a video than that"];

/**
 * The 8ball command
 * @param {TextMessage} message Raw discord text message
 * @param {[String]} args Question to ask the 8ball
 */
function eightball(message, args)
{
    // Make sure the field is not empty
    if (args[0] === undefined) {
        Bot.sendMessage(message.channel, "No question given");
        return;
    }
    
    // Get result
    const RESPONSE_INDEX = Util.getRandomInt(0, BALL_RESULTS.length);
    message.channel.send(`🎱 The Magic 8-Ball says: "${BALL_RESULTS[RESPONSE_INDEX]}" 🎱`);
}