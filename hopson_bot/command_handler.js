const SimpleCommands = require("./simple_commands.json");
const Bot            = require("./hopson_bot");

module.exports = 
{
    handleCommand : function(message) 
    {
        let content = message.content.slice(1); //Remove the ">" from the message

        //Extract the arguments and the command from the message
        content     = content.split();
        let command = content[0].toLowerCase();
        let args    = content.slice(1);

        tryRespondToCommand(message, command, args);
    }
}

class Command
{
    constructor(action, description, acceptsArgs) {
        this.action         = action;
        this.description    = description;
        this.acceptsArgs    = acceptsArgs;
    }
}

//Set up the commands
let simpleCommands  = new Map();

function addSimpleCommand(name, output, description) 
{
    simpleCommands.set(name, new Command(output, description, false));
}

//Looks to see if the command sent is actually a command, and then responds to it
function tryRespondToCommand(message, command, args) 
{
    if (command in simpleCommands) {
        if (args.length > 0) return;
        Bot.sendMessage(message.channel, simpleCommands[command].action);
    }
}


//Add commands 
addSimpleCommand(
    "source",
    "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
    "Sends a link to the source code for this bot."
);
