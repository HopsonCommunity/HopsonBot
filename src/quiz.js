const Bot = require("./hopson_bot");
const EventHandle = require('./event_handler')

module.exports = class Quiz
{
    constructor()
    {
        this.quizActive     = false;
        this.quizChannel    = null;     //The channel the quiz is currently in
        this.question       = null;
    }

    //Attempts to begin a quiz
    tryStartQuiz(channel)
    {
        if (this.quizActive) {
            Bot.sendMessage(channel, `Sorry, a quiz is currently active in ${this.quizChannel.name}`);
        }
        else {
            this.quizActive = true;
            this.quizChannel = channel;
            Bot.sendMessage(channel, "Quiz has begun!");
        }
    }

    //Attempts to end a quiz
    tryEndQuiz(channel) 
    {
        if (!this.quizActive) {
            Bot.sendMessage(channel, `Sorry, a quiz is not active.`);
        }
        else if (channel.name != this.quizChannel.name) {   //Cannot end a quiz from a different channel
            Bot.sendMessage(channel, `Sorry, you can not end a quiz from a different channel from which is currently active, which is **'${this.quizChannel.name}'**.`);
        }
        else {
            this.quizActive = false;
            this.quizChannel = null;
            Bot.sendMessage(channel, `Quiz has been stopped manually`)
        }
    }
}
