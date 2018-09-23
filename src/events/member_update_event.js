const Discord = require('discord.js');

module.exports = {
    handleUserUpdate: function (client, oldUser, newUser)
    {
        let botlog = client.channels.get("362124431801450526");
        let time = (new Date()).toLocaleString('en-GB');

        if (oldUser.username != newUser.username){
            let embed = new Discord.RichEmbed()
                .setDescription(`Username Change at ${time}`)
                .setColor(9699539)
                .addField("Old Username", oldUser.username)
                .addField("New Username", newUser.username);

            botlog.send(embed);
        }
    }
}
