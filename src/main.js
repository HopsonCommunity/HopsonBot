const Discord   = require('discord.js');
const Config    = require('../data/config');
const HopsonBot = require('./hopson_bot')

const client = new Discord.Client();

//Entry point of the bot itself
new HopsonBot(client).runBot();

client.login(Config.getToken());