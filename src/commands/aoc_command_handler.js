const CommandHandler = require('./command_handler');
const fetch          = require('node-fetch');

/**
 * Command handler for Advent of Code
 */
module.exports = class AOCCommandHandler extends CommandHandler {
    constructor() {
        super('aoc');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "top10", 
            "Gets the top 10 advent of code users for this server leaderboard",
            ">aoc top10",
            outputTop10
        );
    }
}

function outputTop10(message, args) {
    const channel = message.channel;
    const author  = message.author;

    fetch(`https://adventofcode.com/2018/leaderboard/private/view/66915.json`)
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log(json);
        });
}