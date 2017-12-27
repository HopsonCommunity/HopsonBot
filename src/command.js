//"Struct" holding the data of a command
module.exports = class Command 
{
    constructor(action, description, acceptsArgs) 
    {
        this.action         = action;
        this.description    = description;
        this.acceptsArgs    = acceptsArgs;
    }
}