const Config            = require('../../data/config.json');
const CommandHandler    = require('./command_handler');
const Discord           = require('discord.js');

module.exports = class RoleEventHandler extends CommandHandler {
    constructor() {
        super('');
        this.initCommands();
    }
    
    initCommands() {
        super.addBasicCommand(  
            "source", 
            "Get the HopsonBot source code (link to GitHub", 
            "https://github.com/HopsonCommunity/HopsonBot")
    }
}