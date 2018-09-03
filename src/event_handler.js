const Bot             = require("./hopson_bot");
const CommandHandler  = require("./command_handler");
const Quiz            = require("./quiz");
const MemberJoin      = require("./member_join");
const Discord         = require("discord.js");
const Config          = require("../data/config.json");

//Main class for the bot, which does what it says on the tin
module.exports = class EventHandler
{
    constructor(client) 
    {
        this.client         = client;
        this.quiz           = new Quiz()
        this.commandHandler = new CommandHandler(this);
    }

    //Start the bot
    run() 
    {
        //Event for when the bot starts
        this.client.on("ready", () =>   
        {
            console.log("Client has logged in to server");
            this.client.user.setPresence({game: {name : "Type >help"}})
                .then(console.log)
                .catch(console.error);
        });

        //Event for when bot is dissconnected
        this.client.on("disconnect", (event) =>  
        {
            console.log(`Client has closed with status code ${event.code} and reason ${event.reason}`)
        });  

        //Event for messages sent to any of the discord channels
        this.client.on("message", (message) => 
        {
            this.handleMessage(message);
        });

        this.client.on("messageDelete", (message) =>
        {
            for (var blacklistedChannel of Config.logBlacklistedChannels) {
                if (message.channel.id == blacklistedChannel) {
                    return;
                }
            }
            
            this.handleDelete(message);
        });

        this.client.on("messageUpdate", (oldMessage, newMessage) =>
        {
            for (var blacklistedChannel of Config.logBlacklistedChannels) {
                if (oldMessage.channel.id == blacklistedChannel) {
                    return;
                }
            }

            this.handleEdit(oldMessage, newMessage);
        });

        this.client.on("guildMemberAdd", (member) =>
        {
            MemberJoin.handleJoin(member);
        });

        this.client.on("userUpdate", (oldUser, newUser) => 
        {
            this.handleUserUpdate(oldUser, newUser);
        });
    }

    /*
        When a message is sent by a user to the discord server, this function handles it
        eg checks if it is a command
    */
    handleMessage(message) 
    {
        if (message.channel.type !== "text") return;

        //Print some message information, which can help with tracking down bugs
        console.log(`Message Sent\nServer: ${message.guild.name}\nChannel: ${message.channel.name}\nUser: ${message.member.displayName}\nContent: ${message}\n`);

        let content = message.content;
        //Ignore messages sent by bots
        if (message.author.bot) {
            return;
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
    }
    
    /*
     * When a message is deleted log the message to #bot_log
     */
    handleDelete(message)
    {
        let botlog = this.client.channels.get("362124431801450526");
        let time = (new Date()).toLocaleString('en-GB');
        let content = message.content;

        if (content.length === 0) return;

        if(content.length > 1000) content = content.slice(0,1000) + " ...";
        
        let embed = new Discord.RichEmbed()
            .setDescription(`${message.author} in ${message.channel} at ${time}`)
            .setColor(16711680)
            .addField("Deleted Message", content);
        
        Bot.sendMessage(botlog, embed);
    }

            
    /*
     * When a message is edited log the old and new message to #bot_log
     */
    handleEdit(oldMessage, newMessage)
    {
        if(oldMessage.author.bot) return;
        if(oldMessage.content === newMessage.content) return;

        let botlog = this.client.channels.get("362124431801450526");
        let time = (new Date()).toLocaleString('en-GB');
        let oldContent = oldMessage.content;
        let newContent = newMessage.content;

        if(oldContent.length > 1000) oldContent = oldContent.slice(0,1000) + " ...";
        if(newContent.length > 1000) newContent = newContent.slice(0,1000) + " ...";

        let embed = new Discord.RichEmbed()
            .setDescription(`${oldMessage.author} in ${oldMessage.channel} at ${time}`)
            .setColor(16737280)
            .addField("Old Message", oldContent)
            .addField("New Message", newContent);

        Bot.sendMessage(botlog, embed);
        this.handleMessage(newMessage);
    }

    /*
     * When a user changes username log the new and old name to #bot_log
     */
    handleUserUpdate(oldUser, newUser)
    {
        let botlog = this.client.channels.get("362124431801450526");
        let time = (new Date()).toLocaleString('en-GB');

        if (oldUser.username != newUser.username){
            let embed = new Discord.RichEmbed()
            .setDescription(`Username Change at ${time}`)
            .setColor(9699539)
            .addField("Old Username", oldUser.username)
            .addField("New Username", newUser.username);

            Bot.sendMessage(botlog, embed);
        }
    }
}
