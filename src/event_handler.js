Bot             = require("./hopson_bot");
CommandHandler  = require("./command_handler");
Quiz            = require("./quiz")

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
            this.handleDelete(message);
        });

        this.client.on("messageUpdate", (oldMessage, newMessage) =>
        {
            this.handleEdit(oldMessage, newMessage);
        });
/*
        this.client.on("userUpdate", (oldUser, newUser) =>
        {
            this.handleUserUpdate(oldMessage, newMessage);
        });
*/
    }

    /*
        When a message is sent by a user to the discord server, this function handles it
        eg checks if it is a command
    */
    handleMessage(message) 
    {
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

    handleDelete(message)
    {
        let content = message.content;
        let author  = message.author;
        let channel = message.channel;

        let botlog = this.client.channels.get("362124431801450526");

        Bot.sendMessage(botlog, `Message deleted in channel ${channel} : \n\n${message}\n\n sent by ${author}`);
    }

    handleEdit(oldMessage, newMessage)
    {

    }
/*
    handleUserUpdate(oldUser, newUser)
    {
        
    }
*/

}

