const Config    = require("../data/config.json");
const Bot       = require ("./hopson_bot");
const Discord   = require('discord.js')
const dateFormat  = require('dateformat');

var exp = module.exports =
{
    handleJoin : function(member) 
    {
        let channelName = Config.memberJoinChannel[member.guild.id];
        let channel     = Bot.getClient().channels.find("name", channelName);

        let join        = dateFormat(member.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        let creation    = dateFormat(member.user.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");

       // let imgURL = member.user.displayAvatarURL;

        Bot.sendMessage(channel, new Discord.RichEmbed()
            .setTitle("User Join")
            //.setImage("Avatar", imgURL)
            .addField("**Name**", `<@${member.user.id}>`)
            .addField("**Join Date**", join)
            .addField("**Account Create Data**", creation)
        );
    }
}