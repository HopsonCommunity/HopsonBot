/*
    Just random command info
*/
module.exports = class Command {
    /*
    * @param {String} description Description of command
    * @param {String} example Example usage of command
    * @param {String or function(MessageInfo)} action Command action
    */
    constructor (description, example, action) {
        this.description = description;
        this.example     = example;
        this.action      = action;
    }
};
