const Config        = require("../../data/config.json");
const Discord       = require('discord.js')
const dateFormat    = require('dateformat');

module.exports = {
    handleLeave(member, client) {
        let channelName = Config.leaveChannel;
        let channel     = client.channels.find("name", channelName);
        let user        = member.user.id;

        //Welcome them
        channel.send(`<@${member.user.id}> has left the server.`);
    }
}