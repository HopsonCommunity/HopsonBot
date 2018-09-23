const Config        = require("../../data/config.json");
const Discord       = require('discord.js')
const dateFormat    = require('dateformat');

module.exports = {
    handleJoin : function(member, client) {
        checkAccountAge(member, client);

        //Give new member role
        let newMemberRole = member.guild.roles.find('name', Config.newMemberRole);
        member.addRole(newMemberRole);

        let channelName = Config.welcomeChannel;
        let channel     = client.channels.find("name", channelName);

        //Welcome them
        channel.send(
`Welcome to Hopson Community server, <@${member.user.id}>! Take a moment to look at the <#293460068483989504>.
Also, please ntroduce yourself in <#463866762786635777>, and I will give you access to the rest of the server.\n
Enjoy! :)`
        );
    }
}

function checkAccountAge(member, client) {
    let channelName = Config.memberJoinChannel;
    let channel     = client.channels.find("name", channelName);

    let join        = dateFormat(member.joinedAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    let creation    = dateFormat(member.user.createdAt, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    let diff        = getTimeDifference(member.joinedAt, member.user.createdAt);
    
    const embed = new Discord.RichEmbed()
        .setTitle("User Join")
        .addField("**Name**", `<@${member.user.id}>`)
        .addField("**Account Create Data**", creation)
        .addField("**Join Date**", join)
        .addField("**Time Between Create and Join (est)**", diff.regularDiff)
        .addField("**Milliseconds Difference**", diff.unixTimeDiff);
    
    channel.send(embed);

    //Notify Admins if account is less than 2 days old
    if (diff.notify) {
        channel.send(`<@&293440127601082368>`);
    }
}


function getTimeDifference(join, create) {
    let diff = join - create;
    let diffDate = new Date(diff);
    let originDate = new Date(0);

    let yearDiff  = diffDate.getFullYear() - originDate.getFullYear();
    let monthDiff = diffDate.getMonth();
    let dayDiff   = diffDate.getDate() - 1; // [1, 31] to [0, 30]
    let hourDiff  = diffDate.getHours();
    let minDiff   = diffDate.getMinutes();
    let secDiff   = diffDate.getSeconds();

    return {
        regularDiff: `${yearDiff} years, ${monthDiff} months, ${dayDiff} days, ${hourDiff} hours, ${minDiff} minutes, ${secDiff} seconds`,
        unixTimeDiff: `${diff}`,
        notify: diff <= 172800000 // ms in 2 days
    }
}
