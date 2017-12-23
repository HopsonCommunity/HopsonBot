module.exports = 
{
    tryReply : function(message, content)
    {
        if (content[0] === ">") 
        {
            reply(message, content.slice(1))
        }
    }
}

//Simple "struct" for replying to messages
class Reply
{
    constructor(rep, description) 
    {
        this.rep = rep;
        this.description = description;
    }
}


//Dictionary of the different replies
var simpleReplies = 
{
    "source": new Reply("You can find my source code here: https://github.com/HopsonCommunity/HopsonBot !", "Gives GitHub link of the bot's source code")
}

var complexReplies = 
{
    "help": new Reply(sendCommandList, "Shows a list of commands")
}

//Tries to reply to a message
function reply(message, content) 
{
    content = content.toLowerCase();
    if (content in simpleReplies)
    {
        send(message, simpleReplies[content].rep);
    }
    else if (content in complexReplies)
    {
        complexReplies[content].rep(message);
    }
}

//Sends the list of commands
function sendCommandList(message)
{
    let commands = "__**List of commands:**__\n";

    for (rep in complexReplies)
    {
        commands = commands.concat("\n>" + rep + " - " + complexReplies[rep].description);
    }

    for (rep in simpleReplies)
    {
        commands = commands.concat("\n>" + rep + " - " + simpleReplies[rep].description);
    }

    send(message, commands);
}

function send(message, text)
{
    message.channel.send(text);
}
