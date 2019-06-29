const PollCommandHandler    = require('../commands/poll_command_handler');
const RoleCommandHandler    = require('../commands/role_command_handler');
const DefaultCommandHandler = require('../commands/default_command_handler');
const RefCommandHandler     = require('../commands/ref_command_handler');
const Config                = require('../../data/config.json');
const Discord               = require('discord.js')
const fs                    = require('fs');
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
            new RefCommandHandler(),
            //new WordsCommandHandler()
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

        //collectMessage(message);
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
    const user = message.member ? message.member.displayName : "No name";
    const msg = message.content;

    console.log("============")
    console.log(`Message Sent\nChannel: ${ch}\nUser: ${user}\nContent: ${msg}\n`);
    console.log("============\n")
}

/**
 * An awful idea, but I was curious to see this and all that
 * @param {Discord message} message The message the user sent
 */
function collectMessage(message) {
    const messageWords = message.content.split(" ").map(v => v.toLowerCase());
    const fileName = "data/words_db.json";
    //ngl probably a better way than a json file, I will not lie
    fs.readFile(fileName, 'utf8', (err, data) => {
            if(err) {
                console.log(err)
                return;
            } 
            let wordStats = JSON.parse(data);
            //O(n^2), improve this pls
            for (const word of messageWords) {
                found = false;
                for (const stat of wordStats) {
                    if (stat.w == word) {
                        stat.c += 1;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    wordStats.push({
                        w: word,
                        c: 1
                    });
                }
            }

            //Sort the data using insertion sort, as the data is mostly sorted already
            for (let i = 1; i < wordStats.length; i++) {
                let key = wordStats[i];
                let j = i - 1;
                while (j >= 0 && wordStats[j].c < key.c) {
                    wordStats[j + 1] = wordStats[j];
                    j = j - 1;
                }
                wordStats[j + 1] = key;
            }


            const output = JSON.stringify(wordStats);  //Rewrite the file
            fs.writeFile(fileName, output, err => {
                if (err) {
                    console.log(err);
                }
            });
        });
}
