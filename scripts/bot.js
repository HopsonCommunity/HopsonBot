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

client.on('messageUpdate', (oldMessage, newMessage) => 
{
    let botLog = oldMessage.guild.channels.find('name', "bot_log");
    let output = "__**Message was updated**__\n";
    output += oldMessage + "\n";
    output += newMessage + "\n";
    botLog.send(output);
});

// Log our bot in
client.login(loginToken);