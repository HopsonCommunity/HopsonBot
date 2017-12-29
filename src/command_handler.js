const Bot = require("./hopson_bot");
const Command   = require("./command");
const Roles     = require("../data/roles.json");
const RoleMod   = require("./role_modifier");
const Quiz      = require("./quiz");
const QuizJSON  = require("../data/quiz_questions.json");
const Misc      = require("./misc/misc_commands");

module.exports = class CommandHandler 
{
    constructor(eventHandler) 
    {
        //Init some maps and list to hold data to be used by command handler
        this.simpleCommands     = new Map();
        this.functionCommands   = new Map();
        this.roles              = Roles.roles;
        this.eventHandle        = eventHandler;

        this.initCommands();
    }

    //Says it on the tin
    handleCommand (message)
    {
        let content = message.content.slice(1); //Remove the ">" from the message

        //Extract the arguments and the command from the message
        content     = content.split(" ");
        let command = content[0].toLowerCase();
        let args    = content.slice(1);

        this.tryRespondToCommand(message, command, args);
    }

    //Returns true if the user is indeed an admin (has admin role)
    isAdmin(user) 
    {
        return user.roles.find("name", "Admins") != null;
    }

    //Looks to see if the command sent is actually a command, and then responds to it
    tryRespondToCommand(message, command, args)
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
        else {
            return;
        }
        Bot.logMessage(`Command "${command}" sent in channel "${message.channel.name}" by "${message.member.displayName}"`)
    }

    //Simple function replies
    sendHelpList(message, args)
    {
        let output = "**__List of commands:__**\n\n";

        function addOutput(m) {
            m.forEach(function(val, key, map) {
                output += `__**>${key}**__\n${val.description}\n\n`;
            });
        }
        //Add in the simple commands to the final outputtted message
        addOutput(this.simpleCommands);
        addOutput(this.functionCommands);
        Bot.sendMessage(message.channel, output);
    }

    //Parses any >quiz command, and does the appropriate action with it
    handleQuizCommand(message, args) 
    {
        let cName = message.channel.name;

        //The bot ofc needs to know what to do: starting or ending a quiz
        if(args.length == 0) {
            Bot.sendMessage(message.channel, "You must provide an action, for more info say >quiz help");
            return;
        }
        //Try begin/ start quiz
        let command = args[0].toLowerCase();
        if (QuizJSON.commands.indexOf(command) === -1) {
            Bot.sendMessage(message.channel, `${command} is an invalid quiz command, the valid ones are ${QuizJSON.commands.join(", ")}`);
        }
        else if (QuizJSON.channels.indexOf(cName) === -1) {
            Bot.sendMessage(message.channel, `To avoid spam, quizzes only work in the following channels:\n>${QuizJSON.channels.join("\n>")}`);
        }
        else {//@TODO Maybe use a map/ dictionary here, to map commands/ action to the function call
            let quiz = this.eventHandle.quiz;
            if      (command === "start"    ) quiz.tryStartQuiz     (message.channel);
            else if (command === "end"      ) quiz.tryEndQuiz       (message.channel, message.member);
            else if (command === "add"      ) quiz.tryAddQuestion   (message.channel, args, message.member.id);//smh u had to be different :triumph:
            else if (command === "cats"     ) quiz.listCategories   (message.channel);
            else if (command === "help"     ) quiz.showHelp         (message.channel);
            else if (command === "skip"     ) quiz.trySkip          (message.member);
            else if (command === "remind"   ) quiz.printQuestion    ();
        }
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

    initCommands() 
    {
        //Add the "simple commands"
        this.addSimpleCommand(
            "source",
            "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
            "Sends a link to the source code for this bot."
        );

        this.addSimpleCommand(
            "rolelist",
            `**Roles you can add to yourself using the "__>role add <name>__" command:**\n> ${this.roles.join("\n> ")}.`,
            "Displays list of roles you are able to add and remove."
        );
        
        //Add the "function commands"
        this.addFunctionCommand(
            "help",
            this.sendHelpList.bind(this),
            "Sends a list of commands.",
            false
        );

        this.addFunctionCommand(
            "role",
            RoleMod.tryModifyRole,
            "Allows the user to add or remove role(s) from '>rolelist'\nUseage: '>role add C++ Java'",
            true
        );

        this.addFunctionCommand(
            "quiz",
            this.handleQuizCommand.bind(this),
            "Access quiz commands. For more info, please use command `>quiz help`",
            true
        );

        this.addFunctionCommand(
            "8ball",
            Misc.eightBall,
            "If you cannot make a decision, why not try using an 8ball?",
            true
        );

	this.addFunctionCommand(
	    "poll",
	    Misc.pollCommand,
	    "Create a poll with reactions as responses",
	    true
	);
    }
}

