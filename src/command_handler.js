const Bot                   = require("./main");
const Command               = require("./command");
const Config                = require("../data/config.json");
const RoleMod               = require("./role_modifier");
const Misc                  = require("./misc/misc_commands");
const Discord               = require("discord.js");
const Test                  = require("./graphs");
const CommandHandlerBase    = require("./command_handler_base")

module.exports = class CommandHandler extends CommandHandlerBase
{

    initializeCommands()
    {
        //Add the "simple commands"
        super.addSimpleCommand(
            "source",
            "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
            "Sends a link to the source code for this bot.",
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
    }
}

