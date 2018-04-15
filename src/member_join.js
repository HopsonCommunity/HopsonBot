const Config    = require("../data/config.json");
const Bot       = require ("./hopson_bot");
const Discord   = require('discord.js')
const dateFormat  = require('dateformat');

var exp = module.exports =
{
    handleJoin : function(member) 
    {
        let channelName = Config.memberJoinChannel[member.guild.id];
        let adminName   = Config.adminRole[member.guild.id];
        
        let channel     = Bot.getClient().channels.find("name", channelName);
        let adminRole   = member.guild.roles.find("name", adminName);

        let join        = dateFormat(member.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        let creation    = dateFormat(member.user.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
        let diff        = getTimeDiffernce(member.joinedAt, member.user.createdAt);

        Bot.sendMessage(channel, new Discord.RichEmbed()
            .setTitle("User Join")
            //.setImage("Avatar", imgURL)
            .addField("**Name**", `<@${member.user.id}>`)
            .addField("**Account Create Data**", creation)
            .addField("**Join Date**", join)
            .addField("**Time Between Create and Join (est)**", diff.str)
        );

        if (diff.notify) {
            Bot.sendMessage(channel, `<@${adminRole.id}>`);
        }
    }
}


function getTimeDiffernce(join, create)
{
    
    let yrs = join.getFullYear() - create.getFullYear();
    let mnh = join.getMonth() - create.getMonth();
    let day  = join.getDate() - create.getDate();
    let hor = join.getHours() - create.getHours(); 
    let min  = join.getMinutes() - create.getMinutes(); 
    let sec  = join.getSeconds() - create.getSeconds(); 

    if (min < 0) {
        hor -= 1;
        min = 60 - Math.abs(min);
    }
    
    notify = yrs <= 0;
    console.log(notify);

    return {
        str: `${yrs} years, ${mnh} months, ${day} days, ${hor} hours, ${min} minutes, ${sec} seconds`,
        notify: notify
    };
}