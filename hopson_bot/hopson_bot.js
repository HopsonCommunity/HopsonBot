
const Discord       = require('discord.js');
const Config        = require('./config');
const EventHandler  = require("./event_handler")

//Log into discord
const client    = new Discord.Client();
client.login(Config.getToken());

//Start the event handler
new EventHandler(client).run();

module.exports = 
{
    sendMessage : function(channel, message) 
    {
        channel.send(message);
    }
}