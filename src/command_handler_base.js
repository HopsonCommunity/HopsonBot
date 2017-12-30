const Bot = require("./hopson_bot");
const Command = require ("./command.js");


module.exports = class CommandHandlerBase
{
    constructor()
    {
        //Init some maps and list to hold data to be used by command handler
        this.simpleCommands     = new Map();
        this.functionCommands   = new Map();
    }

    //Returns true if the user is indeed an admin (has admin role)
    isAdmin(member) 
    {
        return member.roles.find("name", "Admins") != null;
    }

    //Adds simple "print" commands
    addSimpleCommand(name, output, description)
    {
        this.simpleCommands.set(name, new Command(output, description, false));
        Bot.logMessage(`Simple command added! \nName: "${name}"\nDescription:  "${description}"`);
    }

    //Adds commands which call a function
    addFunctionCommand(name, func, description, acceptsArgs)
    {
        this.functionCommands.set(name, new Command(func, description, acceptsArgs));
        Bot.logMessage(`Function command added! \nName: "${name}"\nDescription:  "${description}"\nArgs: ${acceptsArgs}`);
    }

    respondToCommand(message, command, args)
    {
        if (this.isAdmin(message.member)) {
            console.log("Sent by admin");
        }
        //Check to see if it a simple command sent
        if (this.simpleCommands.has(command)) {
            if (args.length > 0)
                return;
            Bot.sendMessage(message.channel, this.simpleCommands.get(command).action);
        }

        //Check to see if it is a function command sent
        if  (this.functionCommands.has(command)) {
            let commandHandle = this.functionCommands.get(command);
            if (!commandHandle.acceptsArgs && args.length > 0){
                return;
            }
            commandHandle.action(message, args);
        }
    }
}