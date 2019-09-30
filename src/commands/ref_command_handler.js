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
                let msg = {embed: {
                    title: `Results found for ${args[0]}:\n`,
                    color: 3447003,
                    fields: []
                }};

                for (const result of results) {
                    //We implement the limit INSIDE the loop, and break if we are done, so we don't have to loop
                    //over protentially hundreds of results if we're already out of the limit
                    if (msg.embed.fields.length >= 24) {
                        msg.embed.fields.push({
                            name: ":warning: Error",
                            value: "There are too many results to display them all, please use a more specific query"
                        });
                        msg.embed.color = 15452468;
                        break;
                    }

                    msg.embed.fields.push({
                        name: "#" + (msg.embed.fields.length + 1),
                        value: result,
                        inline: true
                    });
                }

                channel.send(msg);
            }
            else {
                channel.send({embed: {
                    color: 16525315,
                    fields: [{
                        name: "Error",
                        value: `I cannot find anything in C++ with ${args[0]}`
                    }]
                }});
            }
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });
}
