const CommandHandler    = require('./command_handler');

const request   = require('request-promise');
const cheerio   = require('cheerio');

module.exports = class ReferenceCommandHandler extends CommandHandler {
    constructor() {
        super('ref');
        super.addCommand(
            "cpp", 
            "Gets a link to C++ reference for a specific header",
            ">ref cpp vector",
            cppReference
        );
    }
}

function cppReference(message, args) {
    const channel = message.channel;
    if (args.length < 1) {
        return;
    }

    request("https://en.cppreference.com/w/cpp/header")
        .then((html) => {
            const anchors = cheerio('a', html);
            const hrefs = [];
            for (let i = 0; i < anchors.length; i++) {
                const ref = anchors[i].attribs.href;
                if (ref) {
                    if (ref.startsWith("/w/cpp/")) {
                        hrefs.push(anchors[i].attribs.href);
                    }
                }
            }

            const results = [];
            for (const ref of hrefs) {
                if (ref.search(args[0]) > 0) {
                    console.log(ref);
                    results.push("https://en.cppreference.com/" + ref);
                }
            }
			
            if (results.length > 0) {
                var stringLength = 0;
                for (var str of results)
                    stringLength += str.length;
		
                if (stringLength < 2000) {
                    channel.send(results);
                } else {
                    channel.send("Well, those were too many results! Try making your query a bit more specific...");
                }
            }
            else {
                channel.send(`I cannot find anything in C++ with ${args[0]}`);
            }
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });
}
