module.exports = 
{
    handleCommand : function(message) 
    {
        content = message.content.slice(1); //Remove the ">" from the message
        message.channel.send(content);
    }
}