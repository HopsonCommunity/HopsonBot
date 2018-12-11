const Config        = require("../../data/config.json");
const Discord       = require('discord.js')
const dateFormat    = require('dateformat');

/**
 * Event handler for leaving and that
 */
module.exports = {
    handleLeave(member, client) {
        const channelName   = Config.leaveChannel;
        const channel       = client.channels.find("name", channelName);
        const user          = member.displayName;
        const id            = member.user.id;

        //cya
        channel.send(`"${user}" has left the server. ID: <@${id}> - ${id}`);
    }
}