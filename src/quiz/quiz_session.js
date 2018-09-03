const questionsFile = "data/quiz_questions.json";

const Bot           = require("../hopson_bot");
const Util          = require("../misc/util");
const JSONFile      = require('jsonfile');
const Discord       = require('discord.js')

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
module.exports = class QuizSession 
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