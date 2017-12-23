const Discord = require('discord.js');
const Config  = require('./config');
const Reply   = require('./bot_replies');

const client        = new Discord.Client();
const loginToken    = Config.getToken();
const tryReply      = Reply.tryReply;


client.on('ready', () => 
{
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => 
{
    if (message.author.id === client.user.id) {
        //Prevent bot replying to itself
        return;
    }
    
    tryReply(message, message.content);
});

// Log our bot in
client.login(loginToken);