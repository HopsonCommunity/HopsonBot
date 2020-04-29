const CommandHandler = require('./command_handler');

module.exports = class PollCommandHandler extends CommandHandler {
    constructor() {
        super('quiz');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "begin", 
            "Begins a quiz session",
            ">quiz begin",
            () => {}
        );

        super.addCommand(
            "add",
            "Adds a new question to the quiz database",
            ">quiz add Maths \"What is 5 + 5?\" \"10\"",

        )
    }
};

// function addQuizQuestion(message, args) {
//     const channel = message.channel;
//     const author  = message.author;
// }
