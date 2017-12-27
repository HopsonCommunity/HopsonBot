const Discord   = require('discord.js');
const Config    = require('../data/config');
//Log into discord
const client = new Discord.Client();

var exp = module.exports =
{
    logMessage : function(message) {
        message += "\n";
        console.log(message);
    },
    sendMessage : function(channel, message)
    {
        console.log(`Message sent by bot in channel "${channel.name}"\n\n`);
        channel.send(message);
    },
    getClient : function() 
    {
        return client;
    }
}

//Start the event handler
const EventHandler  = require("./event_handler")
exp.eventHandle = new EventHandler(client).run();

client.login(Config.getToken());