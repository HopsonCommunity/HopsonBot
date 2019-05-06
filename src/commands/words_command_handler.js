const CommandHandler    = require('./command_handler');

const Discord           = require('discord.js');
const fs                = require('fs');


module.exports = class WordCommandHandler extends CommandHandler {
    constructor() {
        super('words');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "top", 
            "Gets the top n words, up to top 10",
            ">words top 3",
            topNWords
        );

        super.addCommand(
            "count",
            "Counts how many times a word has been said",
            ">words count hello",
            countWords
        );
    }
}

function doAction(callback) {
    fs.readFile("data/words.json", 'utf8', (err, data) => {
        if (err) {
            console.log("Error reading file: " + err);
            return;
        }
        const words = JSON.parse(data);
        callback(words);
    });
}

function topNWords(message, args, client) {
    if (args.length < 1) {
        return;
    }
    doAction(words => {
        const n = parseInt(args[0]);
        if (n != NaN) {
            const topWords = words.slice(0, Math.min(Math.min(words.length, n), 10));
            const output = new Discord.RichEmbed()
                .setTitle(`Top ${n} Words`);
            for (const idx in topWords) {
                output.addField(
                    `Rank ${(parseInt(idx) + 1)}`,
                    `***${topWords[idx].w}***, said ***${topWords[idx].c}*** times`
                );
            }
            message.channel.send(output);
        }

    });
}

function countWords(message, args, client) {
    if (args.length < 1) {
        return;
    }
    console.log("Seratrching");
    doAction(words => {
        const search = args[0];
        for (const word of words) {
            if (word.w == search) {
                console.log("Found");
                message.channel.send(`${search} has been said ${word.c} times.`);
                return;
            }
        }
        message.channel.send(`${search} has never been said`);
    });
}