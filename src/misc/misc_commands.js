const Bot = require("../hopson_bot")

const eight_ball = require("./eight_ball");
const poll       = require("./poll");

module.exports =
{
    eightBall : function(message, args) {
	eight_ball.main(message, args);
    },

    pollCommand : function(message, args) {
	poll.main(message, args);
    }
}

   

