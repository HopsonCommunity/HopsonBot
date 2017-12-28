const Bot           = require("./hopson_bot");
const EventHandle   = require('./event_handler');
const Util          = require("./misc/util");
const JSONFile      = require('jsonfile');
const fs            = require('fs');
const Discord       = require('discord.js')

const questionsFile = "data/quiz_questions.json";

//Struct holding data about a question
class Question 
{
    constructor(jsonField)
    {
        this.category = jsonField.cat;
        this.question = jsonField.question;
        this.answer   = jsonField.answer;
    }
}

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
            this.initNewQuestion();
        }
    }

    //Activates a new question for the quiz
    initNewQuestion() 
    {
        let inFile = JSONFile.readFileSync(questionsFile);
        let qIndex = Util.getRandomInt(0, inFile.questions.length);
        this.question = new Question(inFile.questions[qIndex]);

        let output = `**New Question**\n**Category**: ${this.question.category}\n**Question:** ${this.question.question}`;
        Bot.sendMessage(this.quizChannel, output);
    }

    //Prints the list of valid question categroies
    listCategories(channel)
    {
        let inFile = JSONFile.readFileSync(questionsFile);
        Bot.sendMessage(channel, 
            `Quiz Categories:\n>${inFile.categories.join("\n>")}`);
    }

    //Shows the list of quiz commands
    showHelp(channel)
    {
        

        let output = new Discord.RichEmbed()
            .setTitle("__**Quiz Commands**__")
            .addField("__**start**__",
                      "Starts a new quiz.\n" +  
                      "Usage: '>quiz start'") 
            .addField("__**end**__",
                      "Ends a quiz, given one is already active in the channel.\n" +
                      "Usage: '>quiz end'")
            .addField("__**add**__\n",
                      "Adds a new question into the quiz.\n" + 
                      "Usage: '>quiz add Maths 'What is 1 + 1?' '2'")
            .addField("__**cats**__\n",
                      "Prints the list of question categories.\n" + 
                      "Usage: '>quiz cats'");
        
/*
        let output = "**__Quiz commands:__**\n\n";
        output += "__**start**__\n";
        output += "Starts a new quiz.\n";
        output += "Usage: '>quiz start'\n\n";

        output += "__**end**__\n";
        output += "Ends a quiz, given one is already active in the channel.\n";
        output += "Usage: '>quiz end'\n\n";

        output += "__**add**__\n";
        output += "Adds a new question into the quiz.\n";
        output += "Usage: '>quiz add Maths 'What is 1 + 1?' '2'\n\n";

        output += "__**cats**__\n";
        output += "Prints the list of question categories.\n";
        output += "Usage: '>quiz cats'\n\n";
        */
        Bot.sendMessage(channel, output);
    }

    //Adds a question to the JSON file
    addQuestion(category, q, a) 
    {
        fs.readFile(questionsFile, 'utf8', function read(err, data){
            if(err) {
                console.log(err)
            } 
            else {
                let qFile = JSON.parse(data);   //Read file into a json object
                qFile.questions.push({          //Add question to the questions array
                    cat: category,
                    question: q,
                    answer: a
                });
                let qOut = JSON.stringify(qFile, null, 4);  //Rewrite the file
                fs.writeFile(questionsFile, qOut, function(err){console.log(err);});
            }
        });
    }

    //on tin
    tryAddQuestion(channel, args) 
    {
        //Check question length
        let inFile = JSONFile.readFileSync(questionsFile);
        args = args.slice(1);
        if (args.length == 0 || args.length < 3) {
            Bot.sendMessage(channel, "You have not provided me with enough information to add a question; I must know the category, question, and the answer to the question.");
            return;
        }

        //Check if the category input is valid
        let category = args[0];
        if (inFile.categories.indexOf(category) === -1) {
            Bot.sendMessage(channel, `Category "${category}" doesn't exist. To see the list, use __*>quiz cats*__, and use correct casing.`)
            return;
        }

        function parseFail() {
            Bot.sendMessage(channel, `For me to recognise a question/ answer, you must start and end your question with"`);
        }

        //Try extract the question and answer from 
        args = args.slice(1);
        //Get question
        let [res1, question, newArgs] = Util.extractStringFromArray(args);
        if (!res1) {
            parseFail();
            return;
        }
        //Get answer
        let [res2, answer, f] = Util.extractStringFromArray(newArgs);
        if (!res2) {
            parseFail();
            return;
        }
        this.addQuestion(category, question, answer);
        Bot.sendMessage(channel, `Question added to my quiz log!\n**Category:** "${category}"\n**Question:** "${question}"\n**Answer:** "${answer}"`);
    }

    endQuiz()
    {
        this.quizActive = false;
        this.quizChannel = null;
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
        if (!this.quizActive || 
             this.quizChannel != message.channel) {
            return;
        }
        if (answer.toLowerCase() == this.question.answer.toLowerCase()) {
            Bot.sendMessage(this.quizChannel, "Answer success!");
            this.endQuiz();
        }
    }
}
