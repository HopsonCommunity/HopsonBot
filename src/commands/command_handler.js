const Discord = require('discord.js');
const Command = require('./command');

/**
 * The base of all command handlers
 */
module.exports = class CommandHandlerBase {
    /**
     * @param {String} commandCategory String sent by user that will invoke this command handler
     */
    constructor(commandCategory) {
        this.commandCategory = commandCategory;
        this.simpleCommands = new Map(); //String and string
        this.commands       = new Map(); //String and Command
        this.addCommand("help", "", "", this.sendHelpList.bind(this));
    }

    /**
     * Returns true if this class is the command handler trying to be accessed
     * @param {String} id A string that is the first part of a message
     */
    isCommand(id) {
        return id === this.commandCategory;
    }

    /**
     * Handles a command
     * @param {Discord Text Message} message The raw message
     * @param {[String]} args The "args" of the command
     */
    handleCommand(message, args, client) {
        let command = args[0];
        console.log(command);
        if (this.simpleCommands.has(command)) {
            message.channel.send(this.simpleCommands.get(command).action);
        }
        else if (this.commands.has(command)) {
            args.splice(0, 1);//remove command name
            let cmd = this.commands.get(command);
            cmd.action(message, args, client);
        }
    }

    /**
     * Add a command which has the response of an simple message
     * @param {String} commandName The ID/ name of the command that will invoke this
     * @param {String} description Description of what the command does
     * @param {String} example Example useage of the command
     * @param {String} action The string that is sent by the bot in response
     */
    addBasicCommand(commandName, description, action) {
        let fullExample = `>${this.commandCategory} ${commandName}`;
        this.simpleCommands.set(commandName, new Command(description, fullExample, action));
    }

    /**
     * Add a command which has the response of a function call
     * @param {String} commandName The ID/ name of the command that will invoke this
     * @param {String} description Description of what the command does
     * @param {String} example Example useage of the command
     * @param {function(messageInfo)} action Function that is called in response the command. This must take in a 3 args, (message, args, client)
     */
    addCommand(commandName, description, example, action) {
        let fullExample = `>${this.commandCategory} ${example}`;
        this.commands.set(commandName, new Command(description, fullExample, action));
    }

    /**
     * [Command] Sends help list
     * @param {MessageInfo} msgInfo Information about the message
     */
    sendHelpList(msgInfo) {
        let output = new Discord.RichEmbed()
            .setTitle("Commands for " + this.commandCategory.toUpperCase())
            .setColor("#09f228");

        function addOutput(m) {
            m.forEach(function(command, commandName, _) {
                if (commandName === "help") return;
                output.addField(`**__${commandName}__**`, 
                                `Description: ${command.description}\nExample: *${command.example}*`);
            });
        }
        addOutput(this.simpleCommands);
        addOutput(this.commands);
        msgInfo.channel.send(output);
    }
}