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

var simpleReplies = {
    "source": "You can find my source code here: https://github.com/HopsonCommunity/HopsonBot !",
};

function reply(message, content) 
{
    content = content.toLowerCase();
    if (content in simpleReplies)
    {
        send(message, simpleReplies[content]);
    }
    else 
    {
        if (content == "help")
        {
            sendCommandList(message);
        }
    }
}

function send(message, text)
{
    message.channel.send(text);
}

function sendCommandList(message)
{
    let commands = "List of commands:";
    for (rep in simpleReplies)
    {
        commands = commands.concat("\n>" + rep);
        console.log(rep);
    }
    send(message, commands);
}