const Bot           = require("./hopson_bot");
const EventHandle   =  require('./event_handler');
const Questions     = require('../data/quiz_questions.json');
const Util          = require("./misc/util");

module.exports = class Quiz
{
    constructor()
    {
        this.quizActive     = false;
        this.quizChannel    = null;     //The channel the quiz is currently in
        this.currQuestion   = null;
        this.currAnswer     = null;

        this.questions  = Questions.questions;
    }

    //Adds a question 
    tryAddQuestion(category, question, answer) 
    {
        if (!category in Questions.categories) {
            Bot.sendMessage(`Category ${category} doesn't exist. To see the list, use ">quiz categories", and use correct casing.`)
        }
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
            this.initNewQuestion();
        }
    }

    //Activates a new question for the quiz
    initNewQuestion() 
    {
        let questionN       = Util.getRandomInt(0, this.questions.length);
        let cat             = this.questions[questionN].cat;
        this.currQuestion   = this.questions[questionN].question;
        this.currAnswer     = this.questions[questionN].answer;
        let output = 
        `**New Question**\n**Category**: ${cat}\n**Question:**: ${this.currQuestion}`;
        Bot.sendMessage(this.quizChannel, output);
    }

   //on tin
   tryAddQuestion(channel, args) 
   {

   }

    //Prints the list of valid question categroies
    listCategories(channel)
    {
        Bot.sendMessage(channel, 
            `Quiz Categories:\n>${Questions.categories.join("\n>")}`);
    }

    //Shows the list of quiz commands
    showHelp(channel)
    {
        let output = "**Quiz commands:**\n";

        output += "__**start**__\m";
        output += "Starts a new quiz.\n";
        output += "Usage: '>quiz start'\n\n";

        output += "__**end**__\m";
        output += "Ends a quiz, given one is already active in the channel.\n";
        output += "Usage: '>quiz end'\n\n";

        output += "__**add**__\n";
        output += "Adds a new question into the quiz.\n";
        output += "Usage: '>quiz add '<category>' '<question>' '<answer>'\n\n";

        output += "__**cats**__\n";
        output += "Prints the list of question categories.\n";
        output += "Usage: '>quiz cats'\n\n";
        Bot.sendMessage(channel, output);
    }

    endQuiz()
    {
        this.quizActive = false;
        this.quizChannel = null;
        this.currAnswer  = "";
        this.currQuestion = "";
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
            this.endQuiz();
            Bot.sendMessage(channel, `Quiz has been stopped manually`)
        }
    }

    submitAnswer(message, answer)
    {
        if (!this.quizActive) return;
        if (this.quizChannel != message.channel) return;
        if (answer == this.currAnswer) {
            Bot.sendMessage(this.quizChannel, "Answer success!");
            this.endQuiz();
        }
    }
}
