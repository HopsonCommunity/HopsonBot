const Config        = require("../../data/config.json");
const Discord       = require('discord.js')
const dateFormat    = require('dateformat');

module.exports = {
    handleJoin : function(member, client) {
        checkAccountAge(member, client);

        //Give new member role
        const newMemberRole = member.guild.roles.find('name', Config.newMemberRole);
        member.addRole(newMemberRole);

        const channelName = Config.welcomeChannel;
        const channel     = client.channels.find("name", channelName);

        //Welcome them
        channel.send(
`Welcome to Hopson Community server, <@${member.user.id}>! Take a moment to look at the <#293460068483989504>.
Also, please introduce yourself in <#463866762786635777>, and I will give you access to the rest of the server.\n
Enjoy! :)`
        );
    }
}

function checkAccountAge(member, client) {
    const channelName = Config.memberJoinChannel;
    const channel     = client.channels.find("name", channelName);

    const join        = dateFormat(member.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    const creation    = dateFormat(member.user.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    const diff        = getTimeDifference(member.joinedAt, member.user.createdAt);
    
    const embed = new Discord.RichEmbed()
        .setTitle("User Join")
        .addField("**Name**", `<@${member.user.id}>`)
        .addField("**Account Create Data**", creation)
        .addField("**Join Date**", join)
        .addField("**Time Between Create and Join (est)**", diff.regularDiff)
        .addField("**Milliseconds Difference**", diff.unixTimeDiff);
    
    if (diff.notify) {
        embed.setColor(16711680);
    } else {
        embed.setColor(65280);
    }

    channel.send(embed);
}


function getTimeDifference(join, create) {
    const diff = join - create;
    const diffDate = new Date(diff);
    const originDate = new Date(0);

    const yearDiff  = diffDate.getFullYear() - originDate.getFullYear();
    const monthDiff = diffDate.getMonth();
    const dayDiff   = diffDate.getDate() - 1; // [1, 31] to [0, 30]
    const hourDiff  = diffDate.getHours();
    const minDiff   = diffDate.getMinutes();
    const secDiff   = diffDate.getSeconds();

    return {
        regularDiff: `${yearDiff} years, ${monthDiff} months, ${dayDiff} days, ${hourDiff} hours, ${minDiff} minutes, ${secDiff} seconds`,
        unixTimeDiff: `${diff}`,
        notify: diff <= 172800000 // ms in 2 days
    }
}
