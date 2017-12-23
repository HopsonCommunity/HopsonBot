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
    "ping": "pong",
    "pong": "ping",
    "source": "You can find my source code here: https://github.com/HopsonCommunity/HopsonBot!"
};

function reply(message, content) 
{
    content = content.toLowerCase();
    if (content in simpleReplies)
    {
        send(message, simpleReplies[content]);
    }
}

function send(msg, text)
{
    msg.channel.send(text);
}