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
        super("Main Events");
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

    initializeCommands()
    {
        //Add the "simple commands"
        super.addSimpleCommand(
            "source",
            "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
            "Sends a link to the source code for this bot.",
        );

        super.addSimpleCommand(
            "rolelist",
            `**Roles you can add to yourself using the "__>role add <name>__" command:**\n> ${this.roles.join("\n> ")}.`,
            "Displays list of roles you are able to add and remove."
        );

        super.addFunctionCommand(
            "role",
            RoleMod.tryModifyRole,
            "Allows the user to add or remove role(s) from '>rolelist'",
            "role add C++ Java ASM",
            true
        );

        super.addFunctionCommand(
            "quiz",
            this.eventHandle.quiz.handleCommand.bind(this.eventHandle.quiz),
            "Access quiz commands. For more info, please use command `>quiz help`",
            "quiz <command>",
            true
        );

        super.addFunctionCommand(
            "8ball",
            Misc.eightBall,
            "If you cannot make a decision, why not try using an 8ball?",
            "8ball <question here>",
            true
        );

        super.addFunctionCommand(
            "poll",
            Misc.pollCommand,
            "Create a poll with reactions as responses",
            "poll <command>",
            true
        );
    }
}

