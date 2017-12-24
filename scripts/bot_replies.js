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
    "source": new Reply("You can find my source code here: https://github.com/HopsonCommunity/HopsonBot !", "Gives GitHub link of the bot's source code"),
}

//Complex replies call functions
var complexReplies = {
    "help":     new Reply (sendCommandList,     "Shows a list of commands"),
    "echo":     new Reply (sendEcho,            "Echoes the first argument"),
    "ping":     new Reply (sendPing,            "Sends the current ping"),
    "role":     new Reply (modRole,             "Add/ Remove language roles. For a list of avaliable roles, say '>roles' Useage: `>role {add/ remove} {roleName} eg >role add C++")
}

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
    "Pyton",
    "ASM"
];

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
        commands = commands.concat("\n>" + rep + " - " + dict[rep].description);
    }

    for (rep in complexReplies) {
        concat(rep, complexReplies);
    } 

    for (rep in simpleReplies) {
        concat(rep, simpleReplies);
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

function validateModRoles(args)
{
    let modifer = args[0];
    if (args.length != 2) {
        console.log("Invalid arg count");
        return false;
    }   
    if (modifer != "remove" && modifer != "add") {
        console.log("Invalid modifer");
        return false;
    }
    return true;
}

function modRole(message, args)
{
    if (validateModRoles(args))
    {
        //let role = message.guild.roles.find("name", "Test");
        // message.member.addRole(role);

        let modifer = args[0];
        console.log("Able to add/ remove role!");
        if (modifer === "add") {
            
           
        }
        else if (modifer === "remove") {
    
        }
    }
}

function send(message, text)
{
    message.channel.send(text);
}
