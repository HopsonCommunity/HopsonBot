const Config    = require("../data/config.json");
const Bot       = require ("./hopson_bot");
const Discord   = require('discord.js')

var exp = module.exports =
{
    handleJoin : function(member) 
    {
        let channelName = Config.memberJoinChannel[member.guild.id];
        let channel     = Bot.getClient().channels.find("name", channelName);

        let join = member.joinedAt;
        let creation = member.user.createdAt;

        Bot.sendMessage(channel, new Discord.RichEmbed()
            .setTitle("User Join")
            .addField("**Name**", `<@${member.user.id}>`)
            .addField("**Join Date**", join.toISOString().substring(0, 10))
            .addField("**Account Create Data**", creation.toISOString().substring(0, 10))
        );
    }
}