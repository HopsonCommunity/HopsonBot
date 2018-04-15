const Config    = require("../data/config.json");
const Bot       = require ("./hopson_bot");
const Discord   = require('discord.js')

async function serachChannel(channel) {
    let count = 0;
    for (let i = 0; i < 100; i++) {
        console.log(i);
    }
}

var exports = module.exports = 
{
    test : function(message, args) 
    {
        console.log("begin");
        serachChannel();
        console.log("end");
    /*
        let channel = message.channel;
        channel.search({
            before: '2017-12-17'
        }).then(result => {
            Bot.sendMessage(channel, `Number of messages: ${result.number}`);
        }).catch(console.error);*/
    }
}