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
    /*
    let memberName  = oldMessage.member.displayName;
    let channelName = oldMessage.channel.name;
    let botLog      = oldMessage.guild.channels.find('name', "bot_log");

    //Send embed message
    botLog.send({embed: {
        color: 3447003,
        author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
        },
        title: "Message was updated in",
        Fields: [  
        {
            name: "Channel",
            value: channelName
        },
        {
            name: "User",
            value: memberName
        },
        {
            name: "Old Message",
            value: oldMessage
        },
        {
            name: "New Message",
            value: newMessage
        }
        ],
        timestamp: new Date(),
        footer: {
            icon_url: client.user.avatarURL,
            text: ":)"
          }
        }
    });
    */  
});

// Log our bot in
client.login(loginToken);