const Config    = require("../data/config.json");
const Bot       = require ("./hopson_bot");

module.exports =
{
    //Validates a role modifying message is legit, and if it is then modify the user's role
    tryModifyRole: function(message, args)
    {
        //Extract languages and the action to take
        let action = args[0];
        let languages = args.slice(1);

        //Remove duplicates
        languages = languages.filter(function(item, index, arr) {
            return arr.indexOf(item) == index;
        });

        let [isValid, result] = isValidCommand(action, languages, message.guild.id);
        if (isValid) {
            modifyRoles(message, action, languages);
        }
        else {
            Bot.sendMessage(message.channel, result);
        }
    }
}

//Checks if the command sent is valid
function isValidCommand(action, languages, serverID)
{
    //Validify the command's action (add/ remove)
    if (action != "add" && action != "remove") {
        return [false, "Please state whether you want me to 'add' or 'remove' a role."];
    }

    //Validify language list
    if (languages.length === 0) {
        return [false, "Please give me a list of languages from '>rolelist'."];
    }
    for (var language of languages) {
        if (Config.modifiableRoles[serverID].indexOf(language) === -1) {
            return [false, `I do not recognise the role "${language}".`];
        }
    }
    return [true, ""];
}

function extractRoles(guild, languageList)
{
    let rolesToMod = [];
    for (lang of languageList) {
        role = guild.roles.find('name', lang);
        rolesToMod.push(role);
    }
    return rolesToMod;
}

function modifyRoles(message, action, languageList)
{
    let rolesToModify   = extractRoles(message.guild, languageList);
    let member          = message.member;

    //Add/ Remove the roles
    if (action === "add") {
        for (role of rolesToModify) {
            member.addRole(role);
        }
        var verb = "added";
        var dir  = "to";
    }
    else if (action === "remove") {
        for (role of rolesToModify) {
            member.removeRole(role);
        }
        var verb = "removed";
        var dir  = "from";
    }
    //Send result
    let res = createOutput(languageList, message.author.id.toString(), verb, dir);
    Bot.sendMessage(message.channel, res);
}

function createOutput(languages, userID, verb, dir)
{
    let sp = languages.length == 1 ?  "role" :  "roles";
    return `I have **${verb}** the following ${sp} ${dir} **<@${userID}>**:\n> ${languages.join("\n>")}`;
}