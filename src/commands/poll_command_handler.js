// Command category created by bag/ Ruixel @ github
// Allows for polling via the use of reactions
// Types of polls:
// - Yes / No
// - Option-based (1, 2, 3, 4)
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
            ">poll yesno Should I go out tonight?",
            pollYesno
        );
        super.addCommand(
            "options", 
            "Poll questions with options",
            '>poll options "Question here" optionA optionB',
            pollOptions
        );
    }
}

/**
 * 
 * @param {Discord message} message The raw discord message
 * @param {[String]} args List of string, the command arguments
 * @param {_} client unused
 */
function pollYesno(message, args, client) {
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

function pollOptions(message, args, client) {
    // Check for a prompt
    if (args[0].charAt(0) == '"') {
        // Find the end of the prompt
        var prompt = "";

        // Iterate through each argument until the end is found
        let index;
        for (index = 0; index < args.length; index++) {
            prompt += args[index] + " ";
            // Check if there's a " at the end of the argument
            // And also that it is not also part of the first quotation mark 
            if (args[index].charAt(args[index].length-1) == '"' && index != 0) {
                // Get rid of excess characters
                prompt = prompt.substring(1, prompt.length - 2);

                // Break the loop
                break;
            }
        }

        console.log("Prompt : '" + prompt + "'");

        // Remove the used arguments
        for (let i = 0; i <= index; i++) {
            args.splice(0, 1);
        }
    }

    // Make sure there's at least two choises
    if (args[0] === undefined || args[1] === undefined) {
        message.channel.send({embed: {
            color: 3447003,
            fields: [{
            name: "*Hopson Polling Station*",
            value: "Please insert 2 or more choices"
            }]
        }});
        return;
    }

    // Set the max number of options
    let max_options = args.length;
    if (args.length > 9)
        max_options = 9;

    // Create the main body for the embedded message
    let field_text = prompt + "\n";

    if (prompt == "" )
    field_text = "Choose: \n";
    
    for (let i = 0; i < max_options; i++) {
        // Convert the underscores in the options with spaces
        args[i] = args[i].replace(/_/g, " ");
        
        // Bag's message
        //field_text = field_text + "   Select " + NUM_EMOJIS[i] + " for: " + args[i] + "\n";

        // Message from jack/jw999's bot
        field_text = field_text + "To vote for " + args[i] + ", react with " + NUM_EMOJIS[i] + "\n";
    }

    message.channel.send({embed: {
        color: 3447003,
        fields: [{
            name: "*Hopson Polling Station*",
            value: field_text
        }]
    }})
    .then(function(message) {
        for (let i = 0; i < max_options; i++) {
            delayedReactWithNumber(message, i);
        }
    });
    
}

function delayedReactWithNumber(message, n)
{
    // 0.5s timeout seems to be the best when theres a large number of options
    setTimeout(function() {
        message.react(NUM_EMOJIS[n]);
    }, 500*n);
}