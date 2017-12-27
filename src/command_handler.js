const Bot = require("./hopson_bot");

const Command   = require("./command");
const Roles     = require("../data/roles.json");
const RoleMod   = require("./role_modifier");

module.exports =
{
    //Says it on the tin
    handleCommand : function(message)
    {
        let content = message.content.slice(1); //Remove the ">" from the message

        //Extract the arguments and the command from the message
        content     = content.split(" ");
        let command = content[0].toLowerCase();
        let args    = content.slice(1);

        tryRespondToCommand(message, command, args);
    }
}

//Init some maps and list to hold data to be used by command handler
var simpleCommands      = new Map();
var functionCommands    = new Map()
var roles               = Roles.roles;

//Returns true if the user is indeed an admin (has admin role)
function isAdmin(user) 
{
    return user.roles.find("name", "Admins") != null;
}

//Looks to see if the command sent is actually a command, and then responds to it
function tryRespondToCommand(message, command, args)
{
    if (isAdmin(message.member)) {
        console.log("Sent by admin");
    }
    //Check to see if it a simple command sent
    if (simpleCommands.has(command)) {
        if (args.length > 0)
            return;
        Bot.sendMessage(message.channel, simpleCommands.get(command).action);
    }

    //Check to see if it is a function command sent
    if  (functionCommands.has(command)) {
        let commandHandle = functionCommands.get(command);
        if (!commandHandle.acceptsArgs && args.length > 0){
            return;
        }
        commandHandle.action(message, args);
    }
    else {
        return;
    }
    Bot.logMessage(`Command "${command}" sent in channel "${message.channel.name}" by "${message.member.displayName}"`)
}


//Simple function replies
function sendHelpList(message, args)
{
    let output = "**__List of commands:__**\n\n";

    function addOutput(m) {
        m.forEach(function(val, key, map) {
            output += `__**>${key}**__\n${val.description}\n\n`;
        });
    }
    //Add in the simple commands to the final outputtted message
    addOutput(simpleCommands);
    addOutput(functionCommands);
    Bot.sendMessage(message.channel, output);
}


//Adds simple "print" commands
function addSimpleCommand(name, output, description)
{
    simpleCommands.set(name, new Command(output, description, false));
    Bot.logMessage(`Simple command added! \nName: "${name}"\nDescription:  "${description}"`);
}

//Adds commands which call a function
function addFunctionCommand(name, func, description, acceptsArgs)
{
    functionCommands.set(name, new Command(func, description, acceptsArgs));
    Bot.logMessage(`Function command added! \nName: "${name}"\nDescription:  "${description}"\nArgs: ${acceptsArgs}`);
}


//Add the "simple commands"
addSimpleCommand(
    "source",
    "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
    "Sends a link to the source code for this bot."
);

addSimpleCommand(
    "rolelist",
    `**Roles you can add to yourself using the "__>role add <name>__" command:**\n> ${roles.join("\n> ")}.`,
    "Displays list of roles you are able to add and remove."
);

//Add the "function commands"
addFunctionCommand(
    "help",
    sendHelpList,
    "Sends a list of commands.",
    false
);


addFunctionCommand(
    "role",
    RoleMod.tryModifyRole,
    "Allows the user to add or remove role(s) from '>rolelist'\nUseage: '>role add C++ Java'",
    true
);