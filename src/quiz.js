const Bot = require("./hopson_bot");

module.exports =
{
    Quiz : class
    {
        constructor()
        {
            this.quizActive     = false;
            this.quizChannel    = null;     //The channel the quiz is currently in
            this.question       = null;
        }

        //Attempts to begin a quiz
        tryBeginQuiz(channel)
        {
            if(quizActive) {
                Bot.sendMessage(channel, `Sorry, a quiz is currently active in ${this.quizChannel.name}`);
            }
            else {
                this.quizActive = true;
                this.quizChannel = channel;
                Bot.sendMessage("Quiz has begun!");
            }
        }

        //Attempts to end a quiz
        tryEndQuiz(channel) 
        {
            if(!quizActive) {
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
    },

    handleQuizCommand : function(message, args) 
    {
        let cName = message.channel.name;

        //The bot ofc needs to know what to do: starting or ending a quiz
        if(args.length == 0) {
            Bot.sendMessage(message.channel, "You must tell me if want to 'start' or 'end' a quiz."); 
            return;
        }

        //Try begin/ start quiz
        let command = args[0].toLowerCase();
        if (command != "start" && command != "end") {
            Bot.sendMessage(message.channel, "You must tell me if want to 'start' or 'end' a quiz."); 
        }
        else if (cName != "bot_testing" && cName != "use-bots-here") {
            Bot.sendMessage(message.channel, "To avoid spam, quizzes only work on the #use-bots-here channel.");
        }
        else {
            command == "start" ?
                Bot.eventHandle.quiz.tryStartQuiz(message.channel) : 
                Bot.eventHandle.quiz.tryEndQuiz  (message.channel);
        }
    }
}