// Command category created by oboforty
// Bot sends minesweeper field using spoilers
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
            "play", 
            "Gives you a minesweeper field of NxM with B bombs..",
            ">mine play 5 5 10",
            mineGen
        );
    }
};

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
    let str0 = "";

    if (mx > 15 || my > 15 || mines >= mx*my*(2/3)){
        message.channel.send("Invalid parameters");
        return;
    }

    message.channel.send("Sending minefield");
    let grid = generateMap(mx, my, mines);
    str0 = createView(grid);
    str0 = message.author.username + " here is your mine field :triangular_flag_on_post: \n" + str0;
    message.author.send(str0);
}

function generateMap(mx, my, mines) {
    let grid = [];
    for (let y = 0; y < my; y++) {
        let arr = [];

        for (let x = 0; x < mx; x++) {
            arr.push(0);
        }

        grid.push(arr);
    }

    // generate mines

    let coords_used = new Set([]);

    while (coords_used.size < mines) {
        x = Math.round(Math.random() * (mx-1));
        y = Math.round(Math.random() * (my-1));

        if (!coords_used.has(`${x},${y}`)) {
            coords_used.add(`${x},${y}`);

            grid[y][x] = 'x';
        }
    }

    for (let x = 0; x < mx; x++) {
        for (let y = 0; y < my; y++) {
            let c = grid[y][x];

            if (c == 'x') {
                continue;
            }

            // mark numbers of neighbor mines
            var nmines = 0;
        
            for (let ny = y - 1; ny <= y + 1; ny++) {
                for (let nx = x - 1; nx <= x + 1; nx++) {
                    // check if valid coordinate
                    if (nx < 0 || ny < 0 || nx >= mx || ny >= my) {
                        continue;
                    }

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
    let str0 = "";
    let mx = grid.length;
    let my = grid[0].length;

    for (let y = 0; y < my; y++) {

        for (let x = 0; x < mx; x++) {
            let c = grid[y][x];
            let char = "?";

            if (c == 'x') {
                char = ':bomb:';
            } else {
                char = NUM_EMOJIS[c];
            }

            str0 += `||${char}|| `;
        }

        str0 += "\n";
    }

    return str0;
}
