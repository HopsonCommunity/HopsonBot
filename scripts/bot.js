const Discord = require('discord.js');
const Config  = require('./config');

const client = new Discord.Client();
const loginToken = Config.getToken();


client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  if (message.content === 'ping') {
    message.channel.send('test');
  }
  
  if (message.content === 'pong') {
    message.channel.send('ping');
  }
});

// Log our bot in
client.login(loginToken);