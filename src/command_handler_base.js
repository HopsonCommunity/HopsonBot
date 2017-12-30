const Bot = require("./hopson_bot");
const Command = require ("./command.js");
const Discord = require ('discord.js')


module.exports = class CommandHandlerBase
{
    constructor(name)
    {
        //Init some maps and list to hold data to be used by command handler
        this.simpleCommands     = new Map();
        this.functionCommands   = new Map();
        this.name = name;

        //Add the "function commands"
        this.addFunctionCommand(
            "help",
            this.sendHelpList.bind(this),
            "Sends a list of commands.",
            false
        );
    }

    //Returns true if the user is indeed an admin (has admin role)
    isAdmin(member) 
    {
        return member.roles.find("name", "Admins") != null;
    }

    //Adds simple "print" commands
    addSimpleCommand(name, output, description, example = "_O")
    {
        example = example == "_O" ? name : example;
        this.simpleCommands.set(name, new Command(output, description, example, false));
    }

    //Adds commands which call a function
    addFunctionCommand(name, func, description, example = "_O", acceptsArgs)
    {
        example = example == "_O" ? name : example;
        this.functionCommands.set(name, new Command(func, description, example, acceptsArgs));
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

    //Simple function replies
    sendHelpList(message, args)
    {
        let output = new Discord.RichEmbed()
            .setTitle("Command list for " + this.name)
            .setColor("#09f228");

        function addOutput(m) {
            m.forEach(function(val, key, map) {
                if (key === "help") return;
                output.addField(`**__${key}__**`, 
                                `${val.description}\nExample: *>${val.exampleUsage}*`);
            });
        }
        //Add in the simple commands to the final outputtted message
        addOutput(this.simpleCommands);
        addOutput(this.functionCommands);
        Bot.sendMessage(message.channel, output);
    }
}