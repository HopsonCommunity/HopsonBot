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

//Roles the user is able to add/ remove to himself
var avaliableRoles = [
    "C++",
    "Wot++",
    "OpenGL",
    "Linux",
    "Windows",
    "SFML",
    "SDL",
    "Java",
    "C#",
    "C-Language",
    "Rust",
    "Python",
    "ASM"
];

//Dictionary of the different replies
var simpleReplies =  {
    "source": new Reply("You can find my source code here: https://github.com/HopsonCommunity/HopsonBot !", "Gives GitHub link of the bot's source code"),
    "roles":  new Reply("Roles:\n* " + avaliableRoles.join("\n* "), "Displays list of roles user is able to add and remove using the 'role' command")
}

//Complex replies call functions
var complexReplies = {
    "role":     new Reply (modRole,             "Add/ Remove language roles. For a list of avaliable roles, say '>roles' Useage: `>role {add/ remove} {roleName} eg >role add C++ Python"),
    "echo":     new Reply (sendEcho,            "Echoes the first argument"),
    "ping":     new Reply (sendPing,            "Sends the current ping"),

    "help":     new Reply (sendCommandList,     "Shows a list of commands") //Keep this one last
}

//Tries to reply to a message
function reply(message, content) 
{
    content = content.split(" ");
    command = content[0].toLowerCase();
    args = content.splice(1);
    let isCommand = false;

    if (command in simpleReplies) {
        send(message, simpleReplies[command].rep);
        isCommand = true;
    }
    else if (command in complexReplies)  {
        complexReplies[command].rep(message, args);
        isCommand = true;
    }

    if (isCommand) {

    }
}

//Sends the list of commands
function sendCommandList(message, args)
{
    let commands = "__**List of commands:**__\n";

    function concat(rep, dict)
    {
        commands = commands.concat("\n>" + rep + "\t-\t" + dict[rep].description);
    }

    for (rep in simpleReplies) {
        concat(rep, simpleReplies);
    }

    for (rep in complexReplies) {
        concat(rep, complexReplies);
    } 

    send(message, commands);
}

function sendEcho(message, args)
{
    if (args.length) {
        send(message, args.join(' '));
    } else {
        send(message, "You didn't give me anything to echo :(");
    }
}

function sendPing(message, args)
{
    send(message, "Ping: " + Math.round(message.client.ping).toString());
    send(message, "Ping: " + message.client.ping.toString());
}

function validateModRoles(message, args)
{
    //Check if there is a list number of args
    if (args.length < 2) {
        send(message, "You didn't provide me enough information. I need to know whether you want to add or remove roles, and the name of the roles.")
        return false;
    }   

    //Check if  the modifier is valid
    let modifer = args[0].toLowerCase();
    if (modifer != "remove" && modifer != "add") {
        send(message, "I need to know whether you want to add or remove roles.")
        return false;
    }

    //Check if the role is actually in the list of avaliable roles
    let languages = args.slice(1);
    for (language of languages)  {
        if (avaliableRoles.indexOf(language) == -1) {
            send(message, "I do not recognise the " + language + " role, sorry. Make sure you have correct casing.");
            return false;
        }
    }
    return true;
}

function modRole(message, args)
{
    if (validateModRoles(message, args))
    {
        function getRoleList(rolesStrings) 
        {
            let roleList = []
            for (r of rolesStrings) {
                roleList.push(message.guild.roles.find("name", r));
            }
            return roleList;
        }
        
        //Get some data
        let modifer = args[0].toLowerCase();
        let langs   = args.slice(1)
        let roles   = getRoleList(langs);

        //Add or remove roles
        if (modifer === "add") {
            for (role of roles) {
                message.member.addRole(role);
            }
            var verb = "added";
        }
        else if (modifer === "remove") {
            for (role of roles) {
                message.member.removeRole(role);
            }
            var verb = "removed";
        }
        //Generate output
        let o = langs.length == 1 ? "role" : "roles";
        let id = message.author.id.toString();
        let output = "I have " + verb + " the following " + o + " to <@" + id + ">:\n* " + langs.join("\n* ");
        send(message, output)
    }
}

function send(message, text)
{
    message.channel.send(text);
}
