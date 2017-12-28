// Command by bag
// Allows for polling via the use of reactions
// Types of polls:
// - Yes / No
// - Option-based (1, 2, 3, 4)

const Bot = require("../hopson_bot")
const util = require('./util');

// Number emojis
var num_emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

module.exports =
{
    main: function(message, args)
    {
	// Determine type of poll
	switch(args[0])
	{
	// Yes or no type of questions
	case "yesno":
	case "yes-no":
	    poll_yesno(message, args);
	    break;

	// Each word is an option
	case "options":
	    poll_options(message, args);
	    break;

	// If none are chosen, prompt a help menu to help the user
	default :
	    poll_help(message);
	}
    }
}

function poll_options(message, args)
{
    // Remove the "options" from the arguments
    args.splice(0, 1);

    // Check for a prompt
    if (args[0].charAt(0) == '"')
    {
	// Find the end of the prompt
	var prompt = "";

	// Iterate through each argument until the end is found
	var index;
	for (index = 0; index < args.length; index++)
	{
	    prompt += args[index] + " ";

	    // Check if there's a " at the end of the argument
	    // And also that it is not also part of the first quotation mark 
	    if (args[index].charAt(args[index].length-1) == '"' && index != 0)
	    {
		// Get rid of excess characters
		prompt = prompt.substring(1, prompt.length - 2);

		// Break the loop
		break;
	    }
	}

	console.log("Prompt : '" + prompt + "'");

	// Remove the used arguments
	for (var i = 0; i <= index; i++)
	{
	    args.splice(0, 1);
	}
    }

    // Make sure there's at least two choises
    if (args[0] === undefined || args[1] === undefined)
    {
	message.channel.send({embed: {
	    color: 3447003,
	    fields: [{
		name: "*Hopson Polling Station*",
		value: "Please insert 2 or more choices"
	    }]
	}});
	return;
    }

    // Set the max number of options
    var max_options = args.length;
    if (args.length > 9)
	max_options = 9;

    // Create the main body for the embedded message
    var field_text = prompt + "\n";

    if (prompt == "" )
	field_text = "Choose: \n";
    
    for (var i = 0; i < max_options; i++) {
	// Convert the underscores in the options with spaces
	args[i] = args[i].replace(/_/g, " ");
	
	// Bag's message
	//field_text = field_text + "   Select " + num_emojis[i] + " for: " + args[i] + "\n";

	// Message from jack/jw999's bot
	field_text = field_text + "To vote for " + args[i] + ", react with " + num_emojis[i] + "\n";
    }

    message.channel.send({embed: {
	color: 3447003,
	fields: [{
	    name: "*Hopson Polling Station*",
	    value: field_text
	}]
    }})
	.then(function(message) {
	    for (var i = 0; i < max_options; i++)
	    {
		delayed_react_with_number(message, i);
	    }
	});
    
}

function delayed_react_with_number(message, n)
{
    // 0.5s timeout seems to be the best when theres a large number of options
    setTimeout(function() {
	message.react(num_emojis[n]);
    }, 500*n);
}

function poll_yesno(message, args)
{   
    // Get the question in string format
    args.splice(0, 1); // Remove the yes-no from the arguments
    var question = args.join(" ");

    console.log("ques: '" + question + "'");

    // Make sure the question is not empty
    if (question == "" || question == " ")
    {
	message.channel.send({embed: {
	    color: 3447003,
	    fields: [{
		name: "*Hopson Polling Station*",
		value: "Please add a question."
	    }]
	}});
	return;
    }
    
    message.channel.send({embed: {
	color: 3447003,
	fields: [{
	    name: "*Hopson Polling Station*",
	    value: question
	}]
    }})
	.then(function(message) {
	    message.react("✅");

	    // Small delay so the cross always comes last
	    setTimeout(function() {
		message.react("❌")
	    }, 500);
	});
	
}

function poll_help(message)
{
    message.channel.send({embed: {
	color: 3447003,
	fields: [{
	    name: "*Hopson Polling Station*",
	    // I know this bit is ugly but with multi line strings, indents can shift the text
	    value:
"Select the type of poll you want:\n\
- **yes-no** for a simple yes or no question\n\
- **options** for a multiple choice question" 
	}],
	footer: {
	    text: "For example: >poll yes-no Is it sunny today?"
	}
    }});
}
