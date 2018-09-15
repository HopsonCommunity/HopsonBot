const Discord         = require("discord.js");
const Config          = require("../data/config.json");

const MessageSentHandler = require("./events/message_sent_handler")

module.exports = class HopsonBot {
    constructor(client) {
        this.client = client;

        this.messageSentHandler = new MessageSentHandler();
    }

    runBot() {
        //Event for when the bot starts
        this.client.on("ready", () => {
            console.log("Client has logged in to server");
            this.client.user.setPresence({game: {name : "Type >help"}})
                .then(console.log)
                .catch(console.error);
        });

        //Event for when bot is dissconnected
        this.client.on("disconnect", (event) => {
            console.log(`Client has closed with status code ${event.code} and reason ${event.reason}`)
        });  

        //Event for messages sent to any of the discord channels
        this.client.on("message", (message) => {
            this.messageSentHandler.handleEvent(message, this.client);
        });

        this.client.on("messageDelete", (message) => {/*
            for (var blacklistedChannel of Config.logBlacklistedChannels) {
                if (message.channel.id == blacklistedChannel) {
                    return;
                }
            }
            
            this.handleDelete(message);*/
        });

        this.client.on("messageUpdate", (oldMessage, newMessage) => {/*
            for (var blacklistedChannel of Config.logBlacklistedChannels) {
                if (oldMessage.channel.id == blacklistedChannel) {
                    return;
                }
            }

            this.handleEdit(oldMessage, newMessage);*/
        });

        this.client.on("guildMemberAdd", (member) => {
           // MemberJoin.handleJoin(member);
        });

        this.client.on("userUpdate", (oldUser, newUser) => {
            //this.handleUserUpdate(oldUser, newUser);
        });
    }
}