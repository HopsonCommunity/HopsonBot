// Command category created by oboforty
// Bot sends minesweeper field using spoilers

const util = require('../util');
const CommandHandler = require('./command_handler');

// Number emojis
const NUM_EMOJIS = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:', ':ten:'];

module.exports = class MineCommandHandler extends CommandHandler {
    constructor() {
        super('mine');
        this.initCommands();
    }
    
    initCommands() {
        super.addCommand(
            "mine", 
            "Gives you a minesweeper field of NxM with B bombs.",
            ">mine 5 5 10",
            mineGen
        );
    }
}

/**
 * 
 * @param {Discord message} message The raw discord message
 * @param {[String]} args List of string, the command arguments
 * @param {_} client unused
 */
function mineGen(message, args, client) {
    const mx = args[0];
    const my = args[1];
    const mines = args[2];

    var grid = generateMap(mx, my, mines);
    var str0 = createView(grid);
    
    str0 = message.author.name + " here is your mine field :triangular_flag_on_post: \n" + str0;

    message.channel.send(str0);
}

function generateMap(mx, my, mines) {
    var grid = [];
    for (var y=0; y<my; y++) {
        var arr = [];

        for (var x=0; x<mx; x++) {
            arr.push(0);
        }

        grid.push(arr);
    }

    // generate mines

    var coords_used = new Set([]);

    while (coords_used.size < mines) {
        var x = Math.round(Math.random() * (mx-1));
        var y = Math.round(Math.random() * (my-1));

        if (!coords_used.has( x+','+y )) {
            coords_used.add( x+','+y );

            grid[y][x] = 'x';
        }
    }

    for (var x=0; x<mx; x++) {
        for (var y=0; y<my; y++) {
            var c = grid[y][x];

            if (c == 'x')
                continue;

            // mark numbers of neighbor mines
            var nmines = 0;
        
            for (var ny=y-1; ny<=y+1; ny++) {
                for (var nx=x-1; nx<=x+1; nx++) {
                    // check if valid coordinate
                    if (nx < 0 || ny < 0 || nx >= mx || ny >= my)
                      continue;

                    if (grid[ny][nx] == 'x') {
                        nmines += 1;
                    }
                }
            }

            grid[y][x] = nmines;
        }
    }

    return grid;
}

function createView(grid) {
    var str0 = "";

    var mx = grid.length;
    var my = grid[0].length;

    var str0 = "";

    for (var y=0; y<my; y++) {

        for (var x=0; x<mx; x++) {
            var c = grid[y][x];
            var char = "?"

            if (c == 'x') char = ':bomb:';
            else char = NUM_EMOJIS[c];

            str0 += "||"+char+"|| ";
        }

        str0 += "\n";
    }

    return str0;
}