/*
  A ping pong bot, whenever you send "ping", it replies "pong".
*/

// Import the discord.js module
const Discord = require('discord.js');
const Config  = require('./config');

// Create an instance of a Discord client
const client = new Discord.Client();

const loginToken = Config.getToken();

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  if (message.content === 'ping') {
    // Send "pong" to the same channel
    message.channel.send('test');
  }
  
  if (message.content === 'pong') {
    // Send "pong" to the same channel
    message.channel.send('lol fuck you, pong');
  }
});

// Log our bot in
client.login(loginToken);