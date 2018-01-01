const questionsFile = "data/quiz_questions.json";

const Bot           = require("./hopson_bot");
const EventHandle   = require('./event_handler');
const Util          = require("./misc/util");
const JSONFile      = require('jsonfile');
const QuizJSON      = require('../' + questionsFile);
const Config        = require('../data/config.json');
const fs            = require('fs');
const Discord       = require('discord.js')
const CommandHandlerBase = require("./command_handler_base")

const embedColour = 0x28abed;


//Struct holding data about a question
class Question 
{
    constructor(jsonField)
    {
        this.category = jsonField.cat;
        this.question = jsonField.question;
        this.answer   = jsonField.answer;
        this.author   = jsonField.author;
    }
}

//struct for holding data about a current person participating in the quiz
class QuizUser
{
    constructor()
    {
        this.score      = 0;
        this.hasSkipped = false;
    }
}


//Handles a single session of a quiz
class QuizSession 
{
    constructor(channel) 
    {
        this.skipVotes  = 0;
        this.channel    = channel;     //The channel the quiz is currently in
        this.question   = this.getQuestion();
        this.users      = new Map();
        this.printQuestion();
        Bot.sendMessage(this.channel, "Quiz has begun!");
    }

    //Sends a message to the channel where the quiz is active
    sendMessage(message)
    {
        message.setColor(embedColour);
        Bot.sendMessage(this.channel, message);
    }

    //Initiates the next question for the quiz
    nextQuestion() 
    {
        this.users.forEach(function(user, key, map) {
            user.hasSkipped = false;
        }.bind(this));
        this.skipVotes = 0;
        this.question = this.getQuestion();
        this.printQuestion("New Question");
    }

    //Adds a member to this quiz session if they have not yet been added
    tryAddUser(member) 
    {
        if(!this.users.has(member) && this.users.size < 23) {
            this.users.set(member, new QuizUser());
        }
    }

    //Adds a skip to the vote, if it exceeds a certain number then the question is skipped, and a new question is preseneted
    addSkip(member) 
    {
        this.tryAddUser(member);
        //A user cannot skip twice
        if(this.users.get(member).hasSkipped) {
            this.sendMessage(new Discord.RichEmbed()
                .setTitle(`You cannot vote to skip twice, ${member.displayName}, sorry.`))
        }
        else {
            this.users.get(member).hasSkipped = true
            this.skipVotes++;
            let skipsNeeded = Math.floor(this.users.size / 2);
            //Check if the current question is able to be skipped
            if (this.skipVotes >= skipsNeeded) {
                this.sendMessage(new Discord.RichEmbed()
                .setTitle("Question Skipped!")
                .addField("Question", this.question.question)
                .addField("Answer", this.question.answer));
                this.nextQuestion();
            }
            else {
                this.sendMessage(new Discord.RichEmbed()
                .setTitle("Skip Vote Registered")
                .addField("Current Votes", this.skipVotes.toString(), true)
                .addField("Votes Needed", skipsNeeded.toString(), true));
            }
        }
    }

    //Gets a random question from the main JSON file
    getQuestion() 
    {
        let inFile = JSONFile.readFileSync(questionsFile);
        let qIndex = Util.getRandomInt(0, inFile.questions.length);
        let question =  new Question(inFile.questions[qIndex]);
        return question;
    }

    //Displays the question
    printQuestion(title)
    {
        this.sendMessage(new Discord.RichEmbed()
            .setTitle(title)
            .addField("**Category**", this.question.category)
            .addField("**Question**", this.question.question)
            .addField("**Question Author**", `<@${this.question.author}>`));
    }

    //Ends the quiz
    endQuiz()
    {
        this.sendMessage(new Discord.RichEmbed()
            .setTitle("Quiz has ended!"));
        this.outputScores("Final");
    }

    //Adds a point to a user, usually because they have answered a question correctly
    addPointTo(member)
    {
        this.tryAddUser(member);
        let quizMember = this.users.get(member);
        quizMember.score++;
    }

    //Sends a message saying the current scores of everyone
    outputScores(title) 
    {
        let output = new Discord.RichEmbed()
            .setTitle(title + " Scores");

        this.users.forEach(function(person, user, map) {
            //output.addField(`<@${user.id}>`, score.toString(), true);
            output.addField(user.displayName, person.score.toString(), true);
        });

        this.sendMessage(output);
    }
        
    //Submits an answer to current question, and if the question is answered correctly, then it gets the next question
    submitAnswer(member, answer)
    {
        if (answer.toLowerCase() == this.question.answer.toLowerCase()) {
            this.sendMessage(new Discord.RichEmbed()
                .setTitle("Answered sucessfully!")
                .addField("Answered By", `<@${member.id}>`));
            this.addPointTo(member);
            this.outputScores("Current");
            this.nextQuestion();
        }
    }
}

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
        let quizChnnels = Config.quizChannels[message.guild.id];
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

    //Adds a question to the JSON file
    addQuestion(category, qu, ans, authorID) 
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
    tryAddQuestion(message, args) 
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
        this.addQuestion(category, question, answer, user.id);
        Bot.sendMessage(channel, new Discord.RichEmbed()
            .setTitle("New Question Added to my quiz log!")
            .setColor(embedColour)
            .addField("**Category**", category)
            .addField("**Question**", question)
            .addField("**Answer**", answer)
            .addField("**Question Author**", `<@${user.id}>`));
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

    countQuestions(message, args)
    {
        let inFile = JSONFile.readFileSync(questionsFile);
        let cats = inFile.categories;
        let ques = inFile.questions;
        let result = new Map();
        let total = 0;
        for (var category of cats) {
            result.set(category, 0);
        }
        for (var question of ques) {
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
        })
        Bot.sendMessage(message.channel, output);
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
            this.tryAddQuestion.bind(this),
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
            this.countQuestions.bind(this),
            "Counts the number of questions in each category, and outputs the results.",
            "quiz cat-count",
        )
    }
}
