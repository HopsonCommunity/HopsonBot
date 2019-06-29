const CommandHandler = require ("./command_handler")
const GuessingGame   = require ('../games/guessing_game');

const GAME_GUESS_NUM = 0;

module.exports = class GameCommandHandler extends CommandHandler {
    constructor(gameSessions) {
        super('game');
        this.games = []
        this.initCommands();
        this.gameSessions = gameSessions
    }

    initCommands() {
        this.games[GAME_GUESS_NUM] = false;
        super.addCommand(
            "guess-num",
            "Begins a very fun session of guessing numbers",
            ">game guess-num",
            this.guessNumber.bind(this)
        )
    }

    guessNumber(message, args) {
        if (!this.games[GAME_GUESS_NUM]) {
            this.games[GAME_GUESS_NUM] = true;
            this.gameSessions.push(new GuessingGame(message.channel, this.gameSessions));
        }
        else {
            message.channel.send("Sorry but guessing number game is already active.");
        }
    }
}