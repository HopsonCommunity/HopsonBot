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

function reply(message, content) 
{
    if (content === 'ping') 
    {
        message.channel.send('pong');
    }
    
    if (content === 'pong') 
    {
        message.channel.send('ping');
    } 
}