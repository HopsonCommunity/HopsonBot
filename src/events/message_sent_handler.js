const PollCommandHandler    = require('../commands/poll_command_handler');
const RoleCommandHandler    = require('../commands/role_command_handler');
const QuizCommandHandler    = require('../commands/quiz_command_handler');
const GameCommandHandler    = require('../commands/game_command_handler');
const DefaultCommandHandler = require('../commands/default_command_handler');
const RefCommandHandler     = require('../commands/ref_command_handler');
const Config                = require('../../data/config.json');
const Discord               = require('discord.js')
/**
 * Class to handle messages sent by the user
 */
module.exports = class MessageSentHandler {
    /**
     * Creates the command handlers and constructs the handler
     */
    constructor () {
        this.gameSessions = []
        this.defaultCommandHandler = new DefaultCommandHandler();
        this.commandHandlers = [
            new PollCommandHandler(),
            new RoleCommandHandler(),
            new GameCommandHandler(this.gameSessions),
            new RefCommandHandler()
            //new QuizCommandHandler(),
        ]
    }
    /**
     * Entry point for handling messages
     * @param {Discord.TextMessage} message The raw message sent by a user
     * @param {Discord client} client The Discord client the message was sent 
     */
    handleMessageSent(message, client) {
        logMessageInfo(message);
        if ((message.channel.type !== "text") || 
            (message.author.bot)) {
            return;
        }
        if (message.channel.name === Config.newMemberChannel) {
            let newMemberRole = message.member.guild.roles.find('name', Config.newMemberRole);
            let introduceRole = message.member.guild.roles.find('name', Config.introRole);
            message.member.removeRole(newMemberRole);
            message.member.addRole(introduceRole);
        }
        
        if (message.content.startsWith('>')) {
            this.handleCommand(message, client);
        }

        for (const session of this.gameSessions) {
            session.update(message);
        }
    }

    /*
            //If a quiz is currently active, then it may be someone trying to answer it
        if (this.quiz.quizActive) {
            console.log(content);
            this.quiz.submitAnswer(message, content.toLowerCase());
        }
        */

    /**
     * Handles a command message
     * @param {MessageInfo} msgInfo Info about message sent by user
     */
    handleCommand(message, client) {
        const content = message.content
                            .slice(1)   //Remove the '>' if it is there
                            .split(' ')
                            .map((s) => {
                                return s.toLowerCase()
                            });
        const commandCategory = content[0];
        let args              = content.slice(1);

        for (const handler of this.commandHandlers) {
            if (handler.isCommand(commandCategory)) {
                handler.handleCommand(message, args, client);
                return;
            }
        }
        if(commandCategory === "help") {
            this._sendHelpList(message.channel);
        } 
        else {
            args.unshift(commandCategory);
            this.defaultCommandHandler.handleCommand(message, args, client);
        }
    }

    _sendHelpList(channel) {
        let defaultCommands = this.defaultCommandHandler.getCommands();
        let output = new Discord.RichEmbed()
            .setTitle("HopsonBot Command List")
            .setColor("#09f228");;

        defaultCommands.forEach((command, commandName, _) => {
            if (commandName === "help") return;
            output.addField(`**__${commandName}__**`, 
                            `Description: ${command.description}\nExample: *${command.example}*`);
        });

        for (let handler of this.commandHandlers) {
            let cat = handler.commandCategory;
            output.addField(`__**Command Category**: *${cat}*__`, 
                            `See commands: *>${cat} help*`);
        }
        channel.send(output);
    }
}

function logMessageInfo(message) {
    const ch = message.channel.name;
    const user = message.member.displayName;
    const msg = message.content;

    console.log("============")
    console.log(`Message Sent\nChannel: ${ch}\nUser: ${user}\nContent: ${msg}\n`);
    console.log("============\n")
}