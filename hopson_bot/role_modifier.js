const Roles = require ("./roles.json");
const Bot   = require ("./hopson_bot");

module.exports = 
{
    //Validates a role modifying message is legit, and if it is then modify the user's role
    tryModifyRole: function(message, args) 
    {
        let [isValid, result] = isValidCommand(args);
        console.log(args);
        console.log(isValid);
        if (isValid) {
            
        } 
        else {
            Bot.sendMessage(message.channel, result);
        }
    }
}

//Checks if the command sent is valid
function isValidCommand(args) 
{
    let action = args[0];
    console.log(action);
    if (action != "add" && action != "remove") {
        return [false, "Please state whether you want to 'add' or 'remove' a role."];
    }
    return [true, ""];
}