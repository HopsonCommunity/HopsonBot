module.exports = 
{
    tryReply : function(message, content)
    {
        if (content[0] === ">")  {
            reply(message, content.slice(1))
        }
    }
}

//Simple "struct" for replying to messages
class Reply
{
    constructor(rep, description)  {
        this.rep = rep;
        this.description = description;
    }
}


//Dictionary of the different replies
var simpleReplies =  {
    "source": new Reply("You can find my source code here: https://github.com/HopsonCommunity/HopsonBot !", "Gives GitHub link of the bot's source code")
}

var complexReplies = {
    "help": new Reply(sendCommandList, "Shows a list of commands"),
    "echo": new Reply(sendEcho, "Echoes the first argument")
}

//Tries to reply to a message
function reply(message, content) 
{
    content = content.split(" ");
    command = content[0].toLowerCase();
    args = content.splice(1);

    console.log(command, args);

    if (command in simpleReplies) {
        send(message, simpleReplies[command].rep);
    }
    else if (command in complexReplies)  {
        complexReplies[command].rep(message, args);
    }
}

//Sends the list of commands
function sendCommandList(message, args)
{
    let commands = "__**List of commands:**__\n";

    for (rep in complexReplies) {
        commands = commands.concat("\n>" + rep + " - " + complexReplies[rep].description);
    }

    for (rep in simpleReplies) {
        commands = commands.concat("\n>" + rep + " - " + simpleReplies[rep].description);
    }

    send(message, commands);
}

function sendEcho(message, args)
{
    if(args.length){
        send(message, args.join(' '));
    }else{
        send(message, "You didn't give me anything to echo :(");
    }
}

function send(message, text)
{
    message.channel.send(text);
}
