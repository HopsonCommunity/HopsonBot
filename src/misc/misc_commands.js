const Bot = require("../hopson_bot")

const eight_ball = require("./eight_ball");

module.exports =
{
    eightBall : function(message, args) {
	eight_ball.main(message, args);
    }
}
