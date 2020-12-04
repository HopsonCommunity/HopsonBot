const Config = require('../../data/config.json');
const CommandHandler = require('./command_handler');
const Discord = require('discord.js');
const JsonFile = require("jsonfile")

const PASTA_FILE = "data/pasta.json"

module.exports = class RoleEventHandler extends CommandHandler {
    constructor() {
        super('pasta');
        super.addCommand(
                "list",
                "Gets a list of added pasta",
                ">pasta list",
                listPasta
            )
            .addCommand(
                "add",
                "Counts how many people have a certain role",
                '>pasta add <name> < ',
                addPasta
            )
            .addCommand(
                "remove",
                "Remove a pasta by name",
                ">pasta remove <name>",
                removePasta
            )
            .addCommand(
                "ANY_COMMAND",
                "Spits out a pasta",
                ">pasta <name_of_pasta_here>",
                spitPasta
            )
    }
}

function listPasta(message, args) {
    const pastas = JsonFile.readFileSync(PASTA_FILE);

    let output = "PASTA LIST\n= = = = = = = \n"
    for (const pasta of pastas) {
        output += `**>pasta ${pasta["name"]}** - Added on _${pasta["dateAdded"]}_ by _${pasta["author"]}_\n`
    }
    message.channel.send(output)
}

function addPasta(message, args) {
    if (args.length == 2) {
        const name = args[0]
        const value = args[1]
        const pastas = JsonFile.readFileSync(PASTA_FILE);

        for (const pasta of pastas) {
            if (pasta["name"] == name) {
                message.channel.send(`I was unable to add pasta ${name}, as it already exists!`);
                return;
            }
        }
        console.log(message)
        // https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
        pastas.push({
            name: name,
            value: value,
            dateAdded: new Date().toISOString().
                replace(/T/, ' ').
                replace(/\..+/, ''),
            author: message.author.username
        });

        JsonFile.writeFile(PASTA_FILE, pastas, function (err) {
            if (err) {
                console.error(err)
            }
        });
        message.channel.send(`Pasta ${name} added!`);
    }
}

function removePasta(message, args) {}

function spitPasta(message, args) {
    if (args.length == 0) {
        return
    }
    const pastas = JsonFile.readFileSync(PASTA_FILE);

    for (const pasta of pastas) {
        if (pasta["name"] == args[0]) {
            message.channel.send(pasta["value"]);
            return;
        }
    }
}