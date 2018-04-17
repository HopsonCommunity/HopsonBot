const Bot = require("./hopson_bot");
const Command   = require("./command");
const Config    = require('../data/config.json')
const RoleMod   = require("./role_modifier");
const Misc      = require("./misc/misc_commands");
const Discord    = require("discord.js");
const Test       = require("./graphs")

const CommandHandlerBase = require("./command_handler_base")

module.exports = class CommandHandler extends CommandHandlerBase
{
    constructor(eventHandler) 
    {
        super("Main Events");
        this.eventHandle = eventHandler;
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

    displayModifiableRoles(message, args) 
    {
        let roleArray = Config.modifiableRoles[message.guild.id];
        let output = new Discord.RichEmbed()
            .setTitle("Modifiable Roles From >role Command");

        for (var roleName of roleArray) {
            output.addField(roleName,  "~", true);
        }
        Bot.sendMessage(message.channel, output);
    }

    countRoles(message, args)
    {
        let roles = message.guild.roles;
        let roleList = roles.array();
        let roleMemberCount = new Map();

        for (var role of roleList) {
            roleMemberCount.set(role.name, role.members.size);
        }

        let output = new Discord.RichEmbed().setTitle("ROLE COUNTS");
        
        let i = 0;
        for (const [key, value] of roleMemberCount.entries()) {
            if (!["Rythm", "Dyno", "Boten", "MEE6", "@everyone"].includes(key)) {
                //output += `**__${key}__**\n${value}\n\n`;
                output.addField(`**__${key}__**`, value, true);
                if (++i >= 25) {
                    break;
                }
            }
        }

        Bot.sendMessage(message.channel, output);
    }

    initializeCommands()
    {
        //Add the "simple commands"
        super.addSimpleCommand(
            "source",
            "You can find my source code at https://github.com/HopsonCommunity/HopsonBot",
            "Sends a link to the source code for this bot.",
        );

        super.addFunctionCommand(
            "rolelist",
            this.displayModifiableRoles,
            "Displays list of roles you are able to add and remove.",
            "rolelist",
            false
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
        super.addFunctionCommand(
            "graph",
            Test.test,
            "Test",
            "graph",
            true
        );
        super.addFunctionCommand(
            "countrole",
            this.countRoles,
            "Showd the number of people in each role",
            "countrole"
        )
    }
}

