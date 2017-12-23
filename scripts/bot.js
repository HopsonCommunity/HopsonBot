const Discord = require('discord.js');
const Config  = require('./config');

const client = new Discord.Client();
const loginToken = Config.getToken();


client.on('ready', () => 
{
    console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => 
{
    if (message.author.id === "394055022436155392")
    {
        return;
    }
    if (message.content === 'ping') 
    {
        message.channel.send('pong');
    }
  
    if (message.content === 'pong') 
    {
        message.channel.send('ping');
    }
    /*
    if (message.author.id == "115025985405059076") 
    {
        var thinking = client.emojis.find("name", "thinking");
        message.react(thinking.id);
    }
    */
    
});

// Log our bot in
client.login(loginToken);