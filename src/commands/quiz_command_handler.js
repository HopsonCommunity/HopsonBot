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
    }
}