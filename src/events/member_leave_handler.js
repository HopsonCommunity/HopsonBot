const Config        = require("../../data/config.json");
const Discord       = require('discord.js')
const dateFormat    = require('dateformat');

module.exports = {
    handleLeave(member, client) {
        let channelName = Config.leaveChannel;
        let channel     = client.channels.find("name", channelName);
        let user        = member.displayName;

        //Welcome them
        channel.send(`"${user}" has left the server.`);
    }
}