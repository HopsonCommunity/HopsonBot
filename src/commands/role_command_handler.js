const Config            = require('../../data/config.json');
const CommandHandler    = require('./command_handler');
const Discord           = require('discord.js');

module.exports = class RoleEventHandler extends CommandHandler {
    constructor() {
        super('role');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "list", 
            "Gets a list of roles that can be modified by the user",
            ">role list",
            listRoles
        );
        super.addCommand(
            "count", 
            "Counts how many people have a certain role",
            '>role count Admins',
            countRole
        );
        super.addCommand(
            "add",
            "Add 1 or more roles to yourself",
            ">role add C++ Java Linux",
            addRoles
        )
        super.addCommand(
            "remove",
            "Remove 1 or more roles from yourself",
            ">role remove C++ Java Linux",
            removeRoles
        )
    }
}

/**
 * Outpus number of members to a single discord role
 * @param {TextMessage} message The raw discord message       
 */
function listRoles(message) {
    const roleArray = Config.modifiableRoles;
    let output = new Discord.RichEmbed()
        .setTitle("Modifiable Roles From >role add/remove Commands");

    for (const role in roleArray) {
        output.addField(
            `Role ${(role)}`,  
            `${roleArray[role]}\n`, 
            true);
        if (role === 25) {
            break;
        }
    }
    message.channel.send(output);
}

/**
 * Outpus number of members to a single discord role
 * @param {TextMessage} message The raw discord message       
 * @param {[String]} args args[0] == role to count 
 */
function countRole(message, args) {
    if (args.length < 1) {
        return;
    }
    const role = message.guild.roles.find((role) => {
        return role.name.toLowerCase() === args[0];
    });

    if (role === null) {
        var output = `Role '${args[0]} does not exist.`;
    }
    else {
        var output = `Number of users with role "**${args[0].toUpperCase()}**": ${role.members.size}`;
    }
    message.channel.send(output);
}

function addRoles(message, args, client) {
    modifyRoles(message, args, "add");
}

function removeRoles(message, args, client) {
    modifyRoles(message, args, "remove");
}

/**
 * Extracts roles from args and then adds/remove valid ones to/from the user
 * @param {TextMessage} message The raw discord message
 * @param {[String]} args List of string, supposedly roles names
 * @param {String} action Add or remove
 */
function modifyRoles(message, args, action) {
    const roleLists = extractRoles(message.guild, args);
    const member    = message.member;

    if (roleLists.invalidRoles.length > 0) {
        message.channel.send(`I do not recognise the following roles: \n>${roleLists.invalidRoles.join('\n>')}`);
    }

    if (roleLists.validRoles.length > 0) {
        //Add/ Remove the roles
        if (action === "add") {
            for (const role of roleLists.validRoles) {
                member.addRole(role)
                    .then (console.log("Role add successful"));
            }
            var verb = "added";
            var dir  = "to";
        }
        else if (action === "remove") {
            for (role of roleLists.validRoles) {
                member.removeRole(role)
                    .then (console.log("Role remove successful"));
            }
            var verb = "removed";
            var dir  = "from";
        }
        //Send result
        const output = createOutput(roleLists.validRoles, message.author.id.toString(), verb, dir);
        message.channel.send(output);
    }
}

/**
 * Creates the output for roles added to the user
 * @param {Role} rolesAdded list of discord roles
 * @param {String} userID the user's ID
 * @param {String} verb can be "added" or "removed"
 * @param {String} dir Direction the roles are going (to or from)
 */
function createOutput(rolesAdded, userID, verb, dir) {
    if (rolesAdded.length === 0) {
        return;
    }
    const sp = rolesAdded.length == 1 ?  "role" :  "roles";
    const roleNames = rolesAdded.map((role) => {
        return role.name;
    });
    let output = `I have **${verb}** the following ${sp} ${dir} **<@${userID}>**:\n> ${roleNames.join("\n>")}\n\n`;
    if (rolesAdded.length == 1) {
        output += `Psst... Are you aware you can have multiple roles ${verb} at once? Give it a go!\n`;
        output += `Example: \`>role add/remove C++ Java Rust\``;
    }
    return output;
}

/**
 * Extracts guild roles from a string array of role names
 * @param {Discord Guild} guild The server where the command was run from
 * @param {[String]} roleList Array of role names to be extracted
 */
function extractRoles(guild, roleList) {
    let result = {
        validRoles: [],
        invalidRoles: []
    }
    const modifiableRoles = Config.modifiableRoles.map(val => val.toLowerCase());
    for (const roleName of roleList) {
        if (modifiableRoles.indexOf(roleName) > -1) {
            const role = guild.roles.find((roleToFind) => {
                return roleToFind.name.toLowerCase() === roleName;
            });
            if (role !== null) {
                result.validRoles.push(role);
            } 
            else {
                result.invalidRoles.push(roleName);
            }
        }
        else {
            result.invalidRoles.push(roleName);
        }
    }
    return result;
}
