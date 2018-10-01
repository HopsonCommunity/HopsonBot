const Config = require('../../data/config.json');
const Discord = require('discord.js');

module.exports = {
    handleMessageDelete: function(client, message) {
        if (isChannelBlacklisted(message.channel)) {
            return;
        }

        if (message.channel.name === Config.newMemberChannel) {
            let introduceRole = message.member.guild.roles.find('name', Config.introRole);
            message.member.removeRole(introduceRole);
        }
        
        const botLog = getBotLogChannel(client);
        const time = (new Date()).toLocaleString('en-GB');
        const content = message.content;
        if (content.length == 0)  return;
        botLog.send(new Discord.RichEmbed()
            .setDescription(`${message.author} in ${message.channel} at ${time}`)
            .setColor(16711680)
            .addField("Deleted Message", content));
        
    },

    handleMessageUpdate: function(client, oldMessage, newMessage) {
        if (isChannelBlacklisted(oldMessage.channel)) return;
        if(oldMessage.content === newMessage.content) return;
        
        const botLog = getBotLogChannel(client);
        const time = (new Date()).toLocaleString('en-GB');
        const oldContent = oldMessage.content;
        const newContent = newMessage.content;

        if (oldContent.length > 1000) oldContent = oldContent.slice(0,1000) + " ...";
        if (newContent.length > 1000) newContent = newContent.slice(0,1000) + " ...";

        const embed = new Discord.RichEmbed()
            .setDescription(`${oldMessage.author} in ${oldMessage.channel} at ${time}`)
            .setColor(16737280)
            .addField("Old Message", oldContent)
            .addField("New Message", newContent);

        botLog.send(embed);
    }
}

function isChannelBlacklisted(channel) {
    for (var blacklistedChannel of Config.logBlacklistedChannels) {
        if (channel.id == blacklistedChannel) {
            return true;
        }
    }
    return false;
}

function getBotLogChannel(client) {
    return client.channels.get("362124431801450526");
}
