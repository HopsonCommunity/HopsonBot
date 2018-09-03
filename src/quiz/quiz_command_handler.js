const questionsFile = "data/quiz_questions.json";
const QuizJSON      = require("../../" + questionsFile);

const Bot           = require("../hopson_bot");
const Util          = require("../misc/util");
const CommandHandlerBase = require("../command_handler_base")
const QuizSession = require("./quiz_session")
const Config        = require('../../data/config.json');

const fs            = require('fs');
const Discord       = require('discord.js')
const JSONFile      = require('jsonfile');

const embedColour = 0x28abed;

//The main "quiz manager" class
module.exports = class QuizEventHandler extends CommandHandlerBase
{
    constructor()
    {
        super("Quiz");
        this.quizActive = false;
        this.session    = null;
        this.initializeCommands();
    }

    //Handle the quiz commands
    handleCommand(message, args)
    {
        let channel = message.channel;
        if(args.length == 0) {
            Bot.sendMessage(message.channel, "You must provide an action, for more info say >quiz help");
            return;
        }
        let quizChnnels = Config.quizChannels;
        if (quizChnnels.indexOf(channel.name) === -1) {
            Bot.sendMessage(message.channel, `To avoid spam, quizzes only work in the following channels:\n>${quizChnnels.join("\n>")}`);
            return;
        }

        let command = args[0].toLowerCase();
        args = args.slice(1);

        super.respondToCommand(message, command, args);
    }

    //Attempts to begin a quiz
    tryStartQuiz(message, args)
    {
        if (this.quizActive) {
            Bot.sendMessage(message.channel, 
                            `Sorry, a quiz is currently active in ${this.session.channel.name}`);
        }
        else {
            this.quizActive     = true;
            this.session        = new QuizSession(message.channel);
        }
    }

    endQuiz()
    {
        this.quizActive = false;
        this.session.endQuiz();
        this.session = null;
    }

    //Attempts to end a quiz
    tryEndQuiz(message, args) 
    {
        let channel = message.channel;
        let user    = message.member;

        if (!this.quizActive) {
            Bot.sendMessage(channel, `Sorry, a quiz is not active.`);
        }
        else if (channel.name != this.session.channel.name) {   //Cannot end a quiz from a different channel
            Bot.sendMessage(channel, `Sorry, you can not end a quiz from a different channel from which is currently active, which is **'${this.session.channel.name}'**.`);
        }
        else {
            this.endQuiz();
            Bot.sendMessage(channel, `Quiz has been stopped manually by <@${user.id}>`)
        }
    }

    submitAnswer(message, answer)
    {
        if (!this.quizActive) return;
        if (this.session.channel != message.channel) return;

        this.session.submitAnswer(message.member, answer);
    }

    printQuestion(message, args) 
    {
        if(this.quizActive) {
            this.session.printQuestion("Question reminder");
        }
    }

    trySkip(message, args) 
    {
        if(this.quizActive) {
            this.session.addSkip(message.member);
        }
    }

    initializeCommands()
    {
        super.addSimpleCommand(
            "cats",
            `Quiz Categories:\n>${QuizJSON.categories.join("\n>")}`,
            "Shows a list of quiz catergories.",
            "quiz cats"
        )

        super.addFunctionCommand(
            "start",
             this.tryStartQuiz.bind(this),
            "Given a quiz is not already active, this will start a new quiz.",
            "quiz start",
            true
        );

        super.addFunctionCommand(
            "end",
            this.tryEndQuiz.bind(this),
            "Ends the quiz session.",
            "quiz end"
        )

        super.addFunctionCommand(
            "add",
            tryAddQuestion,
            "Adds a new question to the quiz log, requies a quiz category, question, and answer.",
            `quiz add Maths "What is 5 + 5?" "10"`,
            true
        )

        super.addFunctionCommand(
            "skip",
            this.trySkip.bind(this),
            "Skips the question; but requirs 1/2 of the quiz participants to do so.",
            "quiz skip",
        )

        super.addFunctionCommand(
            "remind",
            this.printQuestion.bind(this),
            "Resends the question to remind you what it was.",
            "quiz remind",
        )

        super.addFunctionCommand(
            "cat-count",
            countQuestions,
            "Counts the number of questions in each category, and outputs the results.",
            "quiz cat-count",
        )

        super.addFunctionCommand(
            "author-count",
            countAuthors,
            "Says how many questions the authors have submitted",
            "quiz author-count"
        )
    }
}

//Adds a question to the JSON file
function addQuestion(category, qu, ans, authorID) 
{
    //Open the JSON file
    fs.readFile(questionsFile, 'utf8', function read(err, data){
        if(err) {
            console.log(err)
        } 
        else {
            let qFile = JSON.parse(data);   //Read file into a json object
            qFile.questions.push({          //Add question to the questions array
                cat: category,
                question: qu,
                answer: ans,
                author: authorID
            });
            let qOut = JSON.stringify(qFile, null, 4);  //Rewrite the file
            fs.writeFile(questionsFile, qOut, function(err){console.log(err);});
        }
    });
}
//on tin
function tryAddQuestion(message, args) 
{
    let channel = message.channel;
    let user    = message.member;
    console.log(args);
    //Check question length
    let inFile = JSONFile.readFileSync(questionsFile);
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
    //Outputs a message for when the parsing of the strings fails
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
    //Finally if all validations passed, add the question
    addQuestion(category, question, answer, user.id);
    Bot.sendMessage(channel, new Discord.RichEmbed()
        .setTitle("New Question Added to my quiz log!")
        .setColor(embedColour)
        .addField("**Category**", category)
        .addField("**Question**", question)
        .addField("**Answer**", answer)
        .addField("**Question Author**", `<@${user.id}>`));
}

//Outputs the number of questions created by people who have created questions.
function countAuthors(message, args) 
{
    let inFile      = JSONFile.readFileSync(questionsFile);
    let questions   = inFile.questions;
    let result      = new Map();
    //Count the authors
    for (var question of questions) {
        let author = question.author;
        if(result.has(author)) {
            let currentCount = result.get(author);
            result.set(author, currentCount + 1);
        } else {
            result.set(author, 1);
        }
    }
    let output = new Discord.RichEmbed()
        .setTitle("Total Questions for each Author")
        .setColor(embedColour);
    this.count = 0;
    result.forEach(function(val, key, map) {
        output.addField(`${val.toString()} questions by:`,`<@${key}>`, true);
        this.count++;
        if (this.count % 3 == 0) {
            count = 0;
            output.addBlankField();
        }
    }.bind(this));
    Bot.sendMessage(message.channel, output);
}

//Creates a count of how many questions are in each category
function countQuestions(message, args)
{
    let inFile      = JSONFile.readFileSync(questionsFile);
    let cats        = inFile.categories;
    let questions   = inFile.questions;
    let result      = new Map();
    let total       = 0;
    for (var category of cats) {
        result.set(category, 0);
    }
    for (var question of questions) {
        var val = result.get(question.cat);
        result.set(question.cat, val + 1);
        total++;
    }
    let output = new Discord.RichEmbed()
        .setTitle("Total Questions in each Category")
        .setColor(embedColour)
        .addField("Total", total.toString(), true);
    result.forEach(function(val, key, map) {
        output.addField(key, val.toString(), true);
    });
    Bot.sendMessage(message.channel, output);
}