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
        this.author   = jsonField.author;
    }
}

//struct for holding data about a current person participating in the quiz
class QuizUser
{
    constructor()
    {
        this.score      = 1;
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
        message.setColor(0x28abed)
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
        this.printQuestion();
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
    printQuestion()
    {
        this.sendMessage(new Discord.RichEmbed()
            .setTitle("New Question")
            .addField("**Category**", this.question.category)
            .addField("**Question**", this.question.question)
            .addField("**Question Author**", `<@${this.question.author}>`));
    }

    //Ends the quiz
    endQuiz()
    {
        this.sendMessage("Quiz has ended!");
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
module.exports = class Quiz
{
    constructor()
    {
        this.quizActive = false;
        this.session    = null;
    }

    //Attempts to begin a quiz
    tryStartQuiz(channel)
    {
        if (this.quizActive) {
            Bot.sendMessage(channel, `Sorry, a quiz is currently active in ${this.session.channel.name}`);
        }
        else {
            this.quizActive     = true;
            this.quizChannel    = channel;
            this.session        = new QuizSession(channel);
        }
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
                      "Usage: '>quiz cats'")
            .addField("__**skip**__\n",
                      "Skips the question. Requires 1/2 of people playing to skip.\n" + 
                      "Usage: '>quiz skip'")
            .addField("__**remind**__\n",
                      "Re-prints the question.\n" + 
                      "Usage: '>quiz remind'");

        Bot.sendMessage(channel, output);
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
    tryAddQuestion(channel, args, userID) 
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
        this.addQuestion(category, question, answer, userID);
        Bot.sendMessage(channel, new Discord.RichEmbed()
            .setTitle("New Question Added to my quiz log!")
            .addField("**Category**", category)
            .addField("**Question**", question)
            .addField("**Answer**", answer)
            .addField("**Question Author**", `<@${userID}>`));
    }

    endQuiz()
    {
        this.quizActive = false;
        this.session.endQuiz();
        this.session = null;
    }


    //Attempts to end a quiz
    tryEndQuiz(channel, user) 
    {
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

    printQuestion() 
    {
        if(this.quizActive) {
            this.session.printQuestion();
        }
    }

    trySkip(member) 
    {
        if(this.quizActive) {
            this.session.addSkip(member);
        }
    }
}
