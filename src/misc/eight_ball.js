const Util = require('./util')

// Contains the possible results for the 8ball
var ball_results = ["Yes.", "Reply hazy, try again.", "Without a doubt.",
		    "My sources say no.", "As I see it, yes.", "You may rely on it.",
		    "Concentrate and ask again.", "Outlook not so good",
		    "It is decidedly so.", "Better not tell you now.",
		    "Very doubtful.", "Yes - definitely.", "It is certain.",
		    "Cannot predict now.", "Most likely.", "Ask again later.",
		    "My reply is no.", "Outlook good.", "Don't count on it.",
		    "Are you kidding?", "Probably.", "Yes, in due time.", "Go away.",
		    "Hopson is more likely to put out a video than that"];

module.exports =
{
    main: function(message, args)
    {
	
	// Make sure the field is not empty
	console.log("Args[0] " + args[0]);
	if (args[0] === undefined) {
	    Bot.sendMessage(message.channel, "No question given");
	    return;
	}
	
	// Get result
	var result = Util.getRandomInt(0, ball_results.length);
	
	// Print the result to the user
	console.log("result: " + result);
	Bot.sendMessage(message.channel, `🎱 The Magic 8-Ball says: "${ball_results[result]}" 🎱`);
    }
}

   
