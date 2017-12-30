//"Struct" holding the data of a command
module.exports = class Command 
{
    constructor(action, description, exampleUseage, acceptsArgs) 
    {
        this.action         = action;
        this.description    = description;
        this.exampleUsage   = exampleUseage;
        this.acceptsArgs    = acceptsArgs;
        console.log(this.exampleUsage);
    }
}