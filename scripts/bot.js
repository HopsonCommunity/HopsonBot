const Discord   = require('discord.js');
const Config    = require('./config');
const Reply     = require('./bot_replies');
const Bot       = require("./bot");

const client        = new Discord.Client();
const loginToken    = Config.getToken();
const tryReply      = Reply.tryReply;

module.exports = {
    /*
        Adds common data to a rich embeded message, and then sends it to a channel
     */
    sendRichEmbed: function(channel, richEmbed) 
    {
        richEmbed
            .setColor(3447003)
            .setAuthor(
                client.user.username,
                client.user.avatarURL)
            .setFooter("Hopson Bot :)", client.user.avatarURL)
            .setTimestamp();
        channel.send(richEmbed);
    }
}

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
    //Commented out as this throws 
    // if (!/\S/.test(value)) throw new RangeError('RichEmbed field values may not be empty.');
    //:shrug:
    /*
    let memberName  = oldMessage.member.displayName;
    let channelName = oldMessage.channel.name;
    let botLog      = oldMessage.guild.channels.find('name', "bot_log");

    //Create the fields of the embed to send
    embed = new Discord.RichEmbed()
        .addField("__Channel__", channelName)
        .addField("__Member__", memberName)
        .addField("__Old Message__", oldMessage)
        .addField("__New Message__", newMessage)
        .addField("__Time Created__", oldMessage.createdTimestamp)
        .addField("__Time Edited__", newMessage.createdTimestamp);

    //Send it
    Bot.sendRichEmbed(botLog, embed);
    */
});

// Log our bot in
client.login(loginToken);