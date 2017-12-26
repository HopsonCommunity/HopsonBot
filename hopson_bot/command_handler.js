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

        tryRespondToCommand(message, command, args);
    }
}

//Set up the commands
var simpleCommands = new Map();

function addSimpleCommand(name, output, description) 
{
    simpleCommands.set(name, new Command(output, description, false));
    console.log(`Simple command added!\nName: "${name}"\nOutput: "${output}"\nDescription: "${description}"\n`);

}

//Looks to see if the command sent is actually a command, and then responds to it
function tryRespondToCommand(message, command, args) 
{
    console.log("Numaber of args " + args.length);
    console.log("Command sent: "   + command);
    console.log("Map of commands");
    console.log(simpleCommands);
    if (simpleCommands.has(command)) {
        if (args.length > 0) return;
        console.log("Action is: ");
        console.log(typeof simpleCommands["source"].action);
        console.log("\n");
        console.log(typeof simpleCommands[command].action);
        console.log("\n\n\n\n");
        Bot.sendMessage(message.channel, simpleCommands[command].action);
    }
}

//Add commands 
addSimpleCommand(
    "source",
    "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
    "Sends a link to the source code for this bot."
);
