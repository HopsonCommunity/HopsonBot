const Discord = require('discord.js');
const MessageInfo = require('../message_info');

const PollCommandHandler = require('../commands/poll_command_handler')
/**
 * Class to handle messages sent by the user
 */
module.exports = class MessageSentHandler {
    /**
     * Creates the command handlers and constructs the handler
     */
    constructor () {
        this.commandHandlers = [
            new PollCommandHandler()
        ]
    }
    /**
     * Entry point for handling messages
     * @param {Discord.TextMessage} message The raw message sent by a user
     * @param {Discord client} client The Discord client the message was sent 
     */
    handleEvent (message, client) {
        const msgInfo = new MessageInfo(message);
        msgInfo.logInfo();
        if (!msgInfo.isRealTextMessage) {
            return;
        }
        if (msgInfo.isCommand) {
            this.handleCommand(msgInfo);
        }
    }

    /**
     * Handles a command message
     * @param {MessageInfo} msgInfo Info about message sent by user
     */
    handleCommand(msgInfo) {
        for (let handler of this.commandHandlers) {
            if (handler.isCommand(msgInfo.commandCategory)) {
                handler.handleCommand(msgInfo);
            }
        }
    }
}

/*
        if (message.channel.type !== "text") return;

        //Print some message information, which can help with tracking down bugs
        console.log(`Message Sent\nServer: ${message.guild.name}\nChannel: ${message.channel.name}\nUser: ${message.member.displayName}\nContent: ${message}\n`);

        let content = message.content;
        //Ignore messages sent by bots
        if (message.author.bot) {
            return;
        }

        if (message.channel.name === Config.newMemberChannel) {
            let newMemberRole = message.member.guild.roles.find('name', Config.newMemberRole);
            let introduceRole = message.member.guild.roles.find('name', Config.introRole);
            message.member.removeRole(newMemberRole);
            message.member.addRole(introduceRole);
        }

        //A message starting with > indicates it is a command 
        if (content.startsWith(">")) {
            this.commandHandler.handleCommand(message);
        }

        //If a quiz is currently active, then it may be someone trying to answer it
        if (this.quiz.quizActive) {
            console.log(content);
            this.quiz.submitAnswer(message, content.toLowerCase());
        }
*/