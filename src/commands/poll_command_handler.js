// Command category created by bag/ Ruixel @ github
// Allows for polling via the use of reactions
// Types of polls:
// - Yes / No
// - Option-based (1, 2, 3, 4)

const util = require('../misc/util');
const CommandHandler = require('./command_handler');

// Number emojis
const NUM_EMOJIS = [
    '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', 
    '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

module.exports = class PollCommandHandler extends CommandHandler {
    constructor() {
        super('poll');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "yesno", 
            "Poll yes/no style questions",
            "yesno 'Should I go out tonight?'",
            yesno
        );
    }
}

/**
 * 
 * @param {Discord message} message The raw discord message
 * @param {[String]} args List of string, the command arguments
 * @param {_} client unused
 */
function yesno(message, args, client) {
    const question = args.join(" ");

    if (question == "" || question == " ") {
        message.channel.send({embed: {
            color: 3447003,
            fields: [{
            name: "*Hopson Polling Station*",
            value: "Please add a question."
            }]
        }});
        return;
    }
    
    message.channel.send({embed: {
        color: 3447003,
        fields: [{
            name: "*Hopson Polling Station*",
            value: question
        }]
    }})
    .then(function(message) {
        message.react("✅");

        // Small delay so the cross always comes last
        setTimeout(function() 
        {
            message.react("❌")
        }, 500);
    });
}
