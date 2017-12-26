const Bot       = require("./hopson_bot");
const Command   = require ("./command")

module.exports = 
{
    handleCommand : function(message) 
    {
        let content = message.content.slice(1); //Remove the ">" from the message

        //Extract the arguments and the command from the message
        content     = content.split();
        let command = content[0].toLowerCase();
        let args    = content.slice(1);

        console.log(content);
        console.log();
        tryRespondToCommand(message, command, args);
    }
}

//Maps to hold the two command types
var simpleCommands = new Map();

//Looks to see if the command sent is actually a command, and then responds to it
function tryRespondToCommand(message, command, args) 
{
    console.log("Command sent: "   + command);
    if (simpleCommands.has(command)) {
        if (args.length > 0) 
            return;
        Bot.sendMessage(message.channel, simpleCommands.get(command).action);
    }
}


//Add commands 
function addSimpleCommand(name, output, description) 
{
    simpleCommands.set(name, new Command(output, description, false));
    console.log(`Simple command added! \nName: "${name}" \nOutput: "${output}"  \nDescription:  "${description}"\n`);
}

addSimpleCommand(
    "source",
    "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
    "Sends a link to the source code for this bot."
);

/*
//Add commands 
addSimpleCommand(
    "source",
    "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
    "Sends a link to the source code for this bot."
);
*/