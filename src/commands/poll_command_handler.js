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
        super.addCommand(
            "yesno", 
            "Poll yes/no style questions",
            ">poll yesno Should I go out tonight?",
            pollYesno
        )
        .addCommand(
            "options", 
            "Poll questions with options",
            '>poll options "Question here" optionA optionB',
            pollOptions
        );
    }
}

function createHopsonPollingStationEmbed(channel, value) {
    return channel.send({embed: {
        color: 3447003,
        fields: [{
            name: "*Hopson Polling Station*",
            value: value
        }]
    }});
}

/**
 * Sends a poll message for a yes/no question
 * @param {Discord message} message The raw discord message
 * @param {[String]} args List of string, the command arguments
 */
function pollYesno(message, args) {
    const question = args.join(" ");
    if (question == "" || question == " ") {
        createHopsonPollingStationEmbed(message.channel, "Please add a question.");
        return;
    }
    
    createHopsonPollingStationEmbed(message.channel, question)
        .then(message => {
            message.react("✅");

            // Small delay so the cross always comes last
            setTimeout(_ => {
                message.react("❌")
            }, 1000);
    });
}

/**
 * Sends a poll message for a question with multiple optoions
 * @param {Discord message} message The raw discord message
 * @param {[String]} args List of string, the command arguments
 */
function pollOptions(message, args) {
    // Make sure there's at least two choises
    if (args.length < 1) {
        createHopsonPollingStationEmbed(
            message.channel, 
            'Not enough known to create a poll, please provide a question with options eg `">poll option "How many stars is my food?" 1 2 3 4 5"`'
        );
        return;
    }

    if (!args[0].startsWith("\"")) {
        createHopsonPollingStationEmbed(
            message.channel, 
            'Unable to poll! The question should be wrapped between two " characters.'
        );
        return;
    }

    let question = "";
    let full = args.join(" ").slice(1)
    let isQuestion = false;
    for (const c of full) {
        full = full.slice(1);
        if (c === "\"") {
            isQuestion = true;
            break;
        }
        question += c;
    }
    if (!isQuestion) {
        createHopsonPollingStationEmbed(
            message.channel, 
            'Unable to poll! The question should be wrapped between two " characters.'
        );
        return;
    }

    const options = full
        .split(/(\s+)/)
        .filter(v => v != ' ' && v != '');

    if (options.length < 2) {
        createHopsonPollingStationEmbed(
            message.channel, 
            'Unable to poll! At least 2 options must be provided.'
        );
        return;
    }

    let fieldText = question;
    for (const option in options) {
        fieldText += `\nTo answer with ${options[option]}, react with ${NUM_EMOJIS[option]}`
    }

    createHopsonPollingStationEmbed(message.channel, fieldText)
        .then(message => {
            for (const option in options) {
                delayedReactWithNumber(message, option);
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