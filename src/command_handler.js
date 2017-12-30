const Bot = require("./hopson_bot");
const Command   = require("./command");
const Roles     = require("../data/roles.json");
const RoleMod   = require("./role_modifier");
const Quiz      = require("./quiz");
const QuizJSON  = require("../data/quiz_questions.json");
const Misc      = require("./misc/misc_commands");

const CommandHandlerBase = require("./command_handler_base")

module.exports = class CommandHandler extends CommandHandlerBase
{
    constructor(eventHandler) 
    {
        super();
        this.roles              = Roles.roles;
        this.eventHandle        = eventHandler;

        this.initializeCommands();
    }

    //Says it on the tin
    handleCommand (message)
    {
        let content = message.content.slice(1); //Remove the ">" from the message

        //Extract the arguments and the command from the message
        content     = content.split(" ");
        let command = content[0].toLowerCase();
        let args    = content.slice(1);

        super.respondToCommand(message, command, args);
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

    initializeCommands()
    {
        //Add the "simple commands"
        super.addSimpleCommand(
            "source",
            "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
            "Sends a link to the source code for this bot."
        );

        super.addSimpleCommand(
            "rolelist",
            `**Roles you can add to yourself using the "__>role add <name>__" command:**\n> ${this.roles.join("\n> ")}.`,
            "Displays list of roles you are able to add and remove."
        );
        
        //Add the "function commands"
        super.addFunctionCommand(
            "help",
            this.sendHelpList.bind(this),
            "Sends a list of commands.",
            false
        );

        super.addFunctionCommand(
            "role",
            RoleMod.tryModifyRole,
            "Allows the user to add or remove role(s) from '>rolelist'\nUseage: '>role add C++ Java'",
            true
        );

        super.addFunctionCommand(
            "quiz",
            this.handleQuizCommand.bind(this),
            "Access quiz commands. For more info, please use command `>quiz help`",
            true
        );

        super.addFunctionCommand(
            "8ball",
            Misc.eightBall,
            "If you cannot make a decision, why not try using an 8ball?",
            true
        );

        super.addFunctionCommand(
            "poll",
            Misc.pollCommand,
            "Create a poll with reactions as responses",
            true
        );
    }
}

