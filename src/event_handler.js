Bot             = require("./hopson_bot");
CommandHandler  = require("./command_handler");

//Main class for the bot, which does what it says on the tin
module.exports = class EventHandler
{
    constructor(client) 
    {
        this.client = client;
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
            console.log("Client has closed with status code ${event.code} and reason {event.reason}")
        });  

        //Event for messages sent to any of the discord channels
        this.client.on("message", (message) => 
        {
            this.handleMessage(message);
        });
    }

    /*
        When a message is sent by a user to the discord server, this function handles it
        eg checks if it is a command
    */
    handleMessage(message) 
    {
        //Ignore messages sent by bots
        if (message.author.bot) {
            return;
        }
        
        //A message starting with > indicates it is a command 
        if (message.content.startsWith(">")) {
            CommandHandler.handleCommand(message);
        }
    }
}
//Event for when a user sends a message
