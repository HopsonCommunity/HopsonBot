const Roles = require ("./roles.json");
const Bot   = require ("./hopson_bot");

module.exports = 
{
    //Validates a role modifying message is legit, and if it is then modify the user's role
    tryModifyRole: function(message, args) 
    {
        let action = args[0];
        let languages = args.slice(1);

        let [isValid, result] = isValidCommand(action, languages);
        if (isValid) {
            
        } 
        else {
            Bot.sendMessage(message.channel, result);
        }
    }
}

//Checks if the command sent is valid
function isValidCommand(action, languages) 
{
    //Validify the command's action (add/ remove)
    if (action != "add" && action != "remove") {
        return [false, "Please state whether you want me to 'add' or 'remove' a role."];
    }

    //Validify language list
    if (languages.length === 0) {
        return [false, "Please give me a list of languages from '>rolelist'."];
    }
    for (language of languages) {
        if (Roles.roles.indexOf(language) == -1) {
            return [false, `I do not recognise the role "${language}".`];
        }
    }
    return [true, ""];
}