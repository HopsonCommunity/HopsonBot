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
        let diff        = getTimeDifference(member.joinedAt, member.user.createdAt);

        Bot.sendMessage(channel, new Discord.RichEmbed()
            .setTitle("User Join")
            .addField("**Name**", `<@${member.user.id}>`)
            .addField("**Account Create Data**", creation)
            .addField("**Join Date**", join)
            .addField("**Time Between Create and Join (est)**", diff.regularDiff)
            .addField("**Milliseconds Difference**", diff.unixTimeDiff)
        );

    //Notify Admins if account is less than 2 days old
        if (diff.notify) {
            Bot.sendMessage(channel, `<@&293440127601082368>`);
        }
    }
}


function getTimeDifference(join, create)
{
    let diff = join - create;
    let diffDate = new Date(diff);
    let originDate = new Date(0);

    let yearDiff  = diffDate.getFullYear() - originDate.getFullYear();
    let monthDiff = diffDate.getMonth()    - originDate.getMonth();
    let dayDiff   = diffDate.getDate()     - originDate.getDate();
    let hourDiff  = diffDate.getHours()    - originDate.getHours();
    let minDiff   = diffDate.getMinutes()  - originDate.getMinutes();
    let secDiff   = diffDate.getSeconds()  - originDate.getSeconds();

    return {
        regularDiff: `${yearDiff} years, ${monthDiff} months, ${dayDiff} days, ${hourDiff} hours, ${minDiff} minutes, ${secDiff} seconds`,
        unixTimeDiff: `${diff}`,
        notify: diff <= new Date(0, 0, 2 /* days */).getTime()
    }
}
