const Bot = require("./hopson_bot");

module.exports =
{
    Quiz : class
    {
        constructor()
        {
            this.quizActive     = false;
            this.quizChannel    = null;     //The channel the quiz is currently in
            this.question       = "";
            this.userPoints     = new Map(); //String, user's display name
        }

        tryBeginQuiz(channel)
        {
            if(quizActive) {
                Bot.sendMessage(channel, `Sorry, a quiz is currently active in ${this.quizChannel.name}`);
            }
            else {
                this.quizActive = true;
                this.quizChannel = channel;
            }
        }
    }
}